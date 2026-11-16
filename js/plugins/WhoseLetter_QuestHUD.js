/*:
 * @plugindesc v2.2 《未寄出的信件》任務提示 HUD：自動高度／任務更新／原始不透明配色（MV）
 * @author Whose Letter Project
 *
 * @param LetterVariableId
 * @text 已取得信件數量變數ID
 * @type variable
 * @default 1
 *
 * @param NoticeDuration
 * @text 任務更新提示幀數（60幀約1秒）
 * @type number
 * @min 1
 * @default 90
 *
 * @param HudWidth
 * @text HUD寬度
 * @type number
 * @default 350
 *
 * @param PositionX
 * @text X位置
 * @type number
 * @default 16
 *
 * @param PositionY
 * @text Y位置
 * @type number
 * @default 16
 *
 * @help
 * RPG Maker MV 專用。保留原插件指令，可直接取代舊版。
 * QuestHUD show
 * QuestHUD hide
 * QuestHUD text 請進入郵局，尋找負責管理的人員。
 * QuestHUD letters
 * QuestHUD update 請前往中央櫃檯。
 * QuestHUD updateLetters
 *
 * 地圖上自由移動時顯示；對話／選項期間自動隱藏。
 * 「update」先提示約1.5秒「任務已更新」，再顯示新任務。
 * letters模式自動讀取指定變數並更新0／4、1／4等。
 */
(function() {
    'use strict';
    var params = PluginManager.parameters('WhoseLetter_QuestHUD');
    function paramNum(name, def) {
        var val = Number(params[name]);
        return isFinite(val) ? val : def;
    }
    var letterId = Math.max(1, paramNum('LetterVariableId', 1));
    var noticeDuration = Math.max(1, paramNum('NoticeDuration', 90));
    var hudWidth = Math.max(180, paramNum('HudWidth', 350));
    var hudX = paramNum('PositionX', 16);
    var hudY = paramNum('PositionY', 16);

    function createState() {
        return {
            shown: false,
            mode: 'text',
            text: '',
            noticeFrames: 0,
            lastLetterCount: null
        };
    }
    var _systemInitialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _systemInitialize.call(this);
        this._whoseLetterHud = createState();
    };
    function getState() {
        if (!$gameSystem._whoseLetterHud) {
            $gameSystem._whoseLetterHud = createState();
        }
        var state = $gameSystem._whoseLetterHud;
        if (state.noticeFrames == null) state.noticeFrames = 0;
        if (state.lastLetterCount === undefined) state.lastLetterCount = null;
        return state;
    }
    function getLetterCount() {
        return Number($gameVariables.value(letterId)) || 0;
    }
    function startNotice(state) {
        state.noticeFrames = noticeDuration;
        state.shown = true;
    }
    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _pluginCommand.call(this, command, args);
        if (String(command).toLowerCase() !== 'questhud') return;
        var state = getState();
        var action = String(args[0] || '').toLowerCase();
        if (action === 'show') state.shown = true;
        if (action === 'hide') {
            state.shown = false;
            state.noticeFrames = 0;
        }
        if (action === 'text' || action === 'update') {
            state.mode = 'text';
            state.text = args.slice(1).join(' ');
            if (action === 'update') startNotice(state);
            else { state.noticeFrames = 0; state.shown = true; }
        }
        if (action === 'letters' || action === 'updateletters') {
            state.mode = 'letters';
            state.lastLetterCount = getLetterCount();
            if (action === 'updateletters') startNotice(state);
            else { state.noticeFrames = 0; state.shown = true; }
        }
    };
    function Sprite_QuestHUD() { this.initialize.apply(this, arguments); }
    Sprite_QuestHUD.prototype = Object.create(Sprite.prototype);
    Sprite_QuestHUD.prototype.constructor = Sprite_QuestHUD;
    Sprite_QuestHUD.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.x = hudX;
        this.y = hudY;
        var width = Math.max(180, Math.min(hudWidth, Graphics.boxWidth - hudX - 8));
        this.bitmap = new Bitmap(width, 58);
        this._lastKey = '';
        this.visible = false;
    };
    function wrapLines(bmp, text, maxWidth) {
        var lines = [];
        var paragraphs = String(text).split(/\r?\n/);
        paragraphs.forEach(function(part) {
            var line = '';
            for (var i = 0; i < part.length; i++) {
                var ch = part.charAt(i);
                if (line && bmp.measureTextWidth(line + ch) > maxWidth) {
                    lines.push(line); line = ch;
                } else line += ch;
            }
            lines.push(line);
        });
        if (lines.length > 3) {
            lines = lines.slice(0, 3);
            var last = lines[2];
            while (last && bmp.measureTextWidth(last + '…') > maxWidth) {
                last = last.slice(0, -1);
            }
            lines[2] = last + '…';
        }
        return lines;
    }
    Sprite_QuestHUD.prototype.refresh = function(text, notice) {
        var bmp = this.bitmap;
        var width = bmp.width;
        bmp.fontFace = 'GameFont';
        bmp.fontSize = 17;
        bmp.outlineWidth = 0;
        bmp.outlineColor = 'rgba(0,0,0,0)';
        var lines = wrapLines(bmp, text, width - 28);
        var height = 36 + lines.length * 22;
        if (bmp.height !== height) bmp.resize(width, height);
        bmp.clear();
        // 還原原本的100%不透明棕色框與米黃色底。
        bmp.fillRect(0, 0, width, height, '#937A58');
        bmp.fillRect(3, 3, width - 6, height - 6, '#F0E3C5');
        bmp.fontSize = 14;
        bmp.textColor = '#806B4B';
        bmp.outlineWidth = 0;
        bmp.drawText(notice ? '任務通知' : '目前任務',
            14, 5, width - 28, 20, 'left');
        bmp.fontSize = 17;
        bmp.textColor = '#453A2C';
        for (var i = 0; i < lines.length; i++) {
            bmp.drawText(lines[i], 14, 28 + i * 22,
                width - 28, 22, 'left');
        }
    };
    Sprite_QuestHUD.prototype.update = function() {
        Sprite.prototype.update.call(this);
        var state = getState();
        var window = this.parent && this.parent._messageWindow;
        var talking = $gameMessage.isBusy() || !!(window && !window.isClosed());
        if (!state.shown || talking) {
            this.visible = false;
            return;
        }
        this.visible = true;
        if (state.mode === 'letters') {
            var count = getLetterCount();
            if (state.lastLetterCount == null) state.lastLetterCount = count;
            else if (state.lastLetterCount !== count) {
                state.lastLetterCount = count;
                startNotice(state);
            }
        }
        var notice = state.noticeFrames > 0;
        var text = state.text;
        if (state.mode === 'letters') {
            text = '尋找四封未寄出的信件（' + getLetterCount() + '／4）';
        }
        if (notice) text = '任務已更新';
        var key = (notice ? 'notice:' : 'task:') + text;
        if (key !== this._lastKey) {
            this._lastKey = key;
            this.refresh(text, notice);
        }
        if (state.noticeFrames > 0) state.noticeFrames--;
    };
    var _createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _createDisplayObjects.call(this);
        this._questHud = new Sprite_QuestHUD();
        this.addChild(this._questHud);
    };
})();
