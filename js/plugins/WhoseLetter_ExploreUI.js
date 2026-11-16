/*:
 * @plugindesc v1.2 《未寄出的信件》地圖／探索背包＋信件典藏整合 UI（RPG Maker MV）
 * @author Whose Letter Project
 *
 * @param UnlockSwitchId
 * @text 解鎖地圖與道具按鈕的開關ID
 * @type switch
 * @desc 建議設為「尋找四封信任務已開始」；0=一開始顯示。
 * @default 10
 *
 * @param MapPicture
 * @text 郵局平面圖圖片名稱（不含副檔名）
 * @type string
 * @desc 存放在 img/pictures/；留空會顯示簡易平面圖。
 * @default
 *
 * @param LeftX
 * @text 地圖及道具按鈕X
 * @type number
 * @default 16
 *
 * @param ButtonGap
 * @text 按鈕之間間距
 * @type number
 * @default 8
 *
 * @param RoomRightMargin
 * @text 房間名稱右邊距
 * @type number
 * @default 16
 *
 * @param HideDefaultMapName
 * @text 關閉MV原本的左上角地圖名稱
 * @type boolean
 * @on 是
 * @off 否
 * @default true
 *
 * @help
 * RPG Maker MV 專用。請將此檔案放在 js/plugins/，啟用。
 * 建議插件排序：WhoseLetter_QuestHUD 在上、WhoseLetter_ExploreUI 在下。
 *
 * 功能：
 * - 右上角持續顯示「地圖屬性 > 顯示名稱」。
 * - 左側「目前任務」下方縱向排列：「地圖」然後「道具」。
 * - 按鈕可用滑鼠／觸控點選，選單可按 Esc 關閉。
 * - 地圖使用 img/pictures/ 下的圖片，若未指定則顯示簡易平面圖。
 * - 道具欄讀取 MV 真正的道具／重要物品，不另外存一份。
 * - 道具資料庫的「說明」作為詳細文字。
 * - 一般物品備註：<ExploreImage: LoveLetter>，在背包內預覽並放大照片。
 * - 信件備註：<LetterArchive:thanks> 及 <LetterPicture:08 道謝之信>。
 *   背包會直接讀取 <LetterPicture>，顯示「開啟信件典藏」按鈕。
 *   玩家按下後可閱讀信件或回顧三階段反思，再返回原本探索背包。
 * - 信件典藏功能需另外啟用 XY_LetterArchive.js。
 * - 成功用掉鑰匙時，在櫃子事件執行「增減物品：鑰匙 - 1」，
 *   鑰匙便會從探索背包消失；僅查看道具不會消耗它。
 * - 與 NPC 對話時自動隱藏小按鈕及房名。
 *
 * 事件指令「插件指令」可使用：
 * ExploreUI show    # 強制開啟地圖／道具按鈕
 * ExploreUI hide    # 隱藏地圖／道具按鈕
 * ExploreUI auto    # 恢復依照解鎖開關自動控制
 * ExploreUI map     # 打開地圖（已解鎖時）
 * ExploreUI bag     # 打開探索背包（已解鎖時）
 * ExploreUI close   # 關閉已開啟的面板
 *
 * 注意：本插件不會自動停用 RPG Maker MV 的預設 Esc 選單。
 * 請在開場事件加入「更改選單存取：禁止」，如不想使用該選單。
 */
(function() {
    'use strict';
    var raw = PluginManager.parameters('WhoseLetter_ExploreUI');
    function numberParam(key, fallback) {
        var n = Number(raw[key]);
        return isFinite(n) ? n : fallback;
    }
    var switchId = Math.max(0, numberParam('UnlockSwitchId', 10));
    var mapPicture = String(raw.MapPicture || '').trim().replace(/\.png$/i, '');
    var leftX = numberParam('LeftX', 16);
    var buttonGap = Math.max(2, numberParam('ButtonGap', 8));
    var roomRightMargin = Math.max(0, numberParam('RoomRightMargin', 16));
    var hideDefault = String(raw.HideDefaultMapName || 'true') !== 'false';
    var brown = '#937A58';
    var cream = '#F0E3C5';
    var dark = '#453A2C';
    var subtitle = '#806B4B';

    function textStyle(bitmap, px, color) {
        bitmap.fontFace = 'GameFont';
        bitmap.fontSize = px;
        bitmap.textColor = color;
        bitmap.outlineWidth = 0;
        bitmap.outlineColor = 'rgba(0,0,0,0)';
    }
    function drawPanel(bitmap, x, y, w, h) {
        // 完全不透明：原本的棕色邊框與米黃色底色。
        bitmap.fillRect(x, y, w, h, brown);
        bitmap.fillRect(x + 3, y + 3, w - 6, h - 6, cream);
    }
    function wrapText(bitmap, value, maxWidth, maxLines) {
        var paragraphs = String(value || '').split(/\r?\n/);
        var lines = [];
        paragraphs.forEach(function(s) {
            if (!s) { lines.push(''); return; }
            var line = '';
            for (var i = 0; i < s.length; i++) {
                var ch = s.charAt(i);
                if (line && bitmap.measureTextWidth(line + ch) > maxWidth) {
                    lines.push(line); line = ch;
                } else {
                    line += ch;
                }
            }
            lines.push(line);
        });
        if (maxLines && lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
            var last = lines[maxLines - 1];
            while (last && bitmap.measureTextWidth(last + '…') > maxWidth) {
                last = last.slice(0, -1);
            }
            lines[maxLines - 1] = last + '…';
        }
        return lines;
    }
    function inside(x, y, bx, by, bw, bh) {
        return x >= bx && x < bx + bw && y >= by && y < by + bh;
    }
    function currentScene() {
        var s = SceneManager._scene;
        return (s instanceof Scene_Map) ? s : null;
    }
    function unlocked() {
        if (!$gameSystem) return false;
        if ($gameSystem._whoseExploreOverride === true) return true;
        if ($gameSystem._whoseExploreOverride === false) return false;
        return switchId === 0 || $gameSwitches.value(switchId);
    }
    function messageBusy(scene) {
        if ($gameMessage.isBusy()) return true;
        var w = scene && scene._messageWindow;
        return !!(w && !w.isClosed());
    }
    function roomName() {
        return $gameMap && $gameMap.displayName ? String($gameMap.displayName() || '') : '';
    }
    function items() {
        if (!$gameParty) return [];
        return $gameParty.items().filter(function(item) {
            return item && $gameParty.numItems(item) > 0 &&
                !/<ExploreHide>/i.test(item.note || '');
        });
    }
    // 同時接受 ExploreUI 的舊照片標籤和 LetterArchive 的新信件標籤。
    function archiveKeyFromItem(item) {
        if (!item) return '';
        var note = item.note || '';
        var m = /<LetterArchive\s*:\s*(thanks|apology|love|farewell)\s*>/i.exec(note);
        if (m) return m[1].toLowerCase();
        var params = PluginManager.parameters('XY_LetterArchive') || {};
        var mapping = [
            ['Thanks Item ID', 'thanks'],
            ['Apology Item ID', 'apology'],
            ['Love Item ID', 'love'],
            ['Farewell Item ID', 'farewell']
        ];
        for (var i = 0; i < mapping.length; i++) {
            var configured = Number(params[mapping[i][0]] || 0);
            if (configured > 0 && configured === item.id) return mapping[i][1];
        }
        return '';
    }

    function imageFromItem(item) {
        if (!item) return '';
        var note = item.note || '';
        var m = /<LetterPicture\s*:\s*([^>\r\n]+)>/i.exec(note) ||
                /<ExploreImage\s*:\s*([^>\r\n]+)>/i.exec(note);
        if (m) return m[1].trim().replace(/\.png$/i, '');
        var key = archiveKeyFromItem(item);
        if (!key) return '';
        var params = PluginManager.parameters('XY_LetterArchive') || {};
        var field = {thanks:'Thanks Picture', apology:'Apology Picture',
                     love:'Love Picture', farewell:'Farewell Picture'}[key];
        return String(params[field] || '').trim().replace(/\.png$/i, '');
    }

    function archiveOpen() {
        return typeof window !== 'undefined' && window.XYLetterArchive &&
               typeof window.XYLetterArchive.open === 'function';
    }

    function archiveIsOpen() {
        return archiveOpen() && typeof window.XYLetterArchive.isOpen === 'function' &&
               window.XYLetterArchive.isOpen();
    }
    function inventorySignature(list) {
        return list.map(function(item) {
            return item.id + ':' + $gameParty.numItems(item);
        }).join('|');
    }
    var _systemInitialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _systemInitialize.call(this);
        this._whoseExploreOverride = null;
    };
    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _pluginCommand.call(this, command, args);
        if (String(command).toLowerCase() !== 'exploreui') return;
        var action = String(args[0] || '').toLowerCase();
        if (action === 'show') $gameSystem._whoseExploreOverride = true;
        if (action === 'hide') $gameSystem._whoseExploreOverride = false;
        if (action === 'auto') $gameSystem._whoseExploreOverride = null;
        var scene = currentScene();
        if (!scene || !scene._whoseExploreUi) return;
        if (action === 'close' || action === 'hide') scene._whoseExploreUi.close();
        if (action === 'map' && unlocked()) scene._whoseExploreUi.open('map');
        if (action === 'bag' && unlocked()) scene._whoseExploreUi.open('bag');
    };
    if (hideDefault && typeof Window_MapName !== 'undefined') {
        var _mapNameOpen = Window_MapName.prototype.open;
        Window_MapName.prototype.open = function() {
            // Keep map displayName available to our right-side room HUD.
            this._showCount = 0;
            this.close();
        };
    }

    function ExploreUi(scene) {
        this.scene = scene;
        this.root = new Sprite();
        this.scene.addChild(this.root);
        this.room = new Sprite(new Bitmap(220, 38));
        this.mapButton = new Sprite(new Bitmap(92, 36));
        this.bagButton = new Sprite(new Bitmap(92, 36));
        this.root.addChild(this.room);
        this.root.addChild(this.mapButton);
        this.root.addChild(this.bagButton);
        this.overlay = new Sprite(new Bitmap(Graphics.boxWidth, Graphics.boxHeight));
        this.overlay.visible = false;
        this.root.addChild(this.overlay);
        this.detailPicture = new Sprite();
        this.root.addChild(this.detailPicture);
        this.detailPicture.visible = false;
        this.overlayMode = '';
        this.listPage = 0;
        this.selected = 0;
        this._roomName = null;
        this._listSignature = '';
        this._overlayState = '';
        this._mapPictureName = '';
        this._photoFile = '';
        this._geometry = null;
        this._archiveButton = null;
        this.drawButton(this.mapButton.bitmap, '地圖');
        this.drawButton(this.bagButton.bitmap, '道具');
        this.updatePositions();
    }
    ExploreUi.prototype.drawButton = function(bitmap, label) {
        bitmap.clear();
        drawPanel(bitmap, 0, 0, bitmap.width, bitmap.height);
        textStyle(bitmap, 18, dark);
        bitmap.drawText(label, 0, 5, bitmap.width, 26, 'center');
    };
    ExploreUi.prototype.updatePositions = function() {
        var quest = this.scene._questHud;
        var top = 96;
        if (quest && quest.bitmap) {
            top = quest.y + quest.bitmap.height + 8;
        }
        this.mapButton.x = leftX;
        this.mapButton.y = top;
        this.bagButton.x = leftX;
        this.bagButton.y = top + this.mapButton.bitmap.height + buttonGap;
        var name = roomName();
        if (name !== this._roomName) {
            this._roomName = name;
            this.room.bitmap.clear();
            if (name) {
                textStyle(this.room.bitmap, 18, dark);
                var needed = Math.min(220, Math.max(95,
                    Math.ceil(this.room.bitmap.measureTextWidth(name) + 32)));
                this.room.bitmap = new Bitmap(needed, 38);
                this.room.bitmap.clear();
                drawPanel(this.room.bitmap, 0, 0, needed, 38);
                textStyle(this.room.bitmap, 18, dark);
                this.room.bitmap.drawText(name, 12, 6, needed - 24, 26, 'center');
            }
        }
        this.room.x = Graphics.boxWidth - roomRightMargin - this.room.bitmap.width;
        this.room.y = 16;
    };
    ExploreUi.prototype.buttonHit = function(x, y) {
        if (!unlocked() || messageBusy(this.scene) || this.overlayMode) return false;
        return inside(x, y, this.mapButton.x, this.mapButton.y, 92, 36) ||
            inside(x, y, this.bagButton.x, this.bagButton.y, 92, 36);
    };
    ExploreUi.prototype.open = function(mode) {
        if (!unlocked() || messageBusy(this.scene)) return;
        this.overlayMode = mode;
        this.listPage = 0;
        this.selected = 0;
        this._listSignature = '';
        this._overlayState = '';
        $gameTemp.clearDestination();
        this.redrawOverlay();
        this.overlay.visible = true;
    };
    ExploreUi.prototype.close = function() {
        this.overlayMode = '';
        this._archiveButton = null;
        this.overlay.visible = false;
        this.detailPicture.visible = false;
        this.detailPicture.bitmap = null;
        $gameTemp.clearDestination();
    };
    ExploreUi.prototype.preparePanel = function(title) {
        var bitmap = this.overlay.bitmap;
        bitmap.clear();
        bitmap.fillAll('rgba(13,17,19,0.38)');
        var w = Math.min(748, Graphics.boxWidth - 34);
        var h = Math.min(555, Graphics.boxHeight - 30);
        var x = Math.floor((Graphics.boxWidth - w) / 2);
        var y = Math.floor((Graphics.boxHeight - h) / 2);
        drawPanel(bitmap, x, y, w, h);
        textStyle(bitmap, 23, dark);
        bitmap.drawText(title, x + 22, y + 14, w - 95, 32, 'left');
        textStyle(bitmap, 20, dark);
        bitmap.drawText('×', x + w - 44, y + 12, 28, 32, 'center');
        this._geometry = {x:x,y:y,w:w,h:h};
        return bitmap;
    };
    ExploreUi.prototype.redrawOverlay = function() {
        if (!this.overlayMode) return;
        this._archiveButton = null;
        this.detailPicture.visible = false;
        this.detailPicture.bitmap = null;
        if (this.overlayMode === 'map') this.drawMap();
        else if (this.overlayMode === 'bag') this.drawInventory();
        else if (this.overlayMode === 'photo') this.drawPhoto();
    };
    ExploreUi.prototype.drawMap = function() {
        var b = this.preparePanel('郵局平面圖');
        var g = this._geometry;
        this._mapPictureName = mapPicture;
        if (mapPicture) {
            this.detailPicture.bitmap = ImageManager.loadPicture(mapPicture);
            this.detailPicture.visible = true;
            this.detailPicture._mapMode = true;
            this.fitPicture();
        } else {
            // Preview fallback so the plugin works before the user makes an image.
            var bx = g.x + Math.floor(g.w * 0.23);
            var by = g.y + 95;
            var bw = Math.floor(g.w * 0.54);
            var bh = Math.min(87, Math.floor((g.h - 205) / 3));
            var gap = 12;
            var half = Math.floor((bw - gap) / 2);
            var names = ['舊檔案室','員工休息室','郵件分揀室','包裹收發室'];
            textStyle(b, 18, dark);
            for (var i = 0; i < 4; i++) {
                var cx = bx + (i % 2) * (half + gap);
                var cy = by + Math.floor(i / 2) * (bh + gap);
                drawPanel(b, cx, cy, half, bh);
                b.drawText(names[i], cx + 4, cy + 15, half - 8, 28, 'center');
            }
            var lobbyY = by + 2 * (bh + gap);
            drawPanel(b, bx, lobbyY, bw, bh);
            b.drawText('中央大廳（櫃檯）', bx + 4, lobbyY + 12, bw - 8, 30, 'center');
            b.drawText('↓ 正門入口', bx, lobbyY + bh + 6, bw, 26, 'center');
            textStyle(b, 15, subtitle);
            b.drawText('尚未設定 MapPicture：目前顯示簡易配置圖',
                g.x + 18, g.y + g.h - 36, g.w - 36, 20, 'center');
        }
        textStyle(b, 16, dark);
        b.drawText('按 Esc 或右上角 × 關閉', g.x + 20, g.y + g.h - 33, g.w - 40, 22, 'right');
    };
    ExploreUi.prototype.drawPhoto = function() {
        var b = this.preparePanel('信件照片｜放大閱讀');
        var g = this._geometry;
        if (this._photoFile) {
            this.detailPicture.bitmap = ImageManager.loadPicture(this._photoFile);
            this.detailPicture.visible = true;
            this.detailPicture._mapMode = true;
            this.fitPicture();
        }
        textStyle(b, 16, dark);
        b.drawText('按 Esc 或右上角 × 返回背包',
            g.x + 20, g.y + g.h - 34, g.w - 40, 22, 'right');
    };
    ExploreUi.prototype.drawInventory = function() {
        var b = this.preparePanel('探索背包');
        var g = this._geometry;
        var all = items();
        var pageCount = Math.max(1, Math.ceil(all.length / 6));
        this.listPage = Math.min(this.listPage, pageCount - 1);
        if (all.length) this.selected = Math.max(0, Math.min(all.length - 1, this.selected));
        else this.selected = 0;
        var leftW = Math.max(190, Math.floor(g.w * 0.35));
        var dividerX = g.x + leftW + 20;
        b.fillRect(dividerX, g.y + 58, 1, g.h - 110, brown);
        textStyle(b, 17, dark);
        if (!all.length) {
            b.drawText('目前沒有道具', g.x + 20, g.y + 82, leftW - 18, 28, 'left');
        }
        var start = this.listPage * 6;
        for (var i = 0; i < 6 && i + start < all.length; i++) {
            var idx = start + i;
            var item = all[idx];
            var iy = g.y + 70 + i * 59;
            if (idx === this.selected) {
                drawPanel(b, g.x + 13, iy, leftW, 49);
            }
            textStyle(b, 17, dark);
            var itemName = wrapText(b, item.name, leftW - 24, 1)[0];
            b.drawText(itemName, g.x + 21, iy + 4, leftW - 30, 25, 'left');
            var count = $gameParty.numItems(item);
            textStyle(b, 14, subtitle);
            if (count > 1) b.drawText('數量 × ' + count, g.x + 22, iy + 26,
                leftW - 36, 20, 'left');
        }
        textStyle(b, 16, dark);
        b.drawText('◀ 上頁', g.x + 18, g.y + g.h - 53, 86, 24, 'left');
        b.drawText((this.listPage + 1) + ' / ' + pageCount,
            g.x + 110, g.y + g.h - 53, 75, 24, 'center');
        b.drawText('下頁 ▶', g.x + leftW - 70, g.y + g.h - 53, 77, 24, 'right');
        var dx = dividerX + 20;
        var dw = g.x + g.w - dx - 20;
        if (!all.length) {
            textStyle(b, 17, subtitle);
            b.drawText('你找到的信件和鑰匙會顯示在這裡。', dx, g.y + 82,
                dw, 28, 'left');
        } else {
            var current = all[this.selected];
            textStyle(b, 20, dark);
            b.drawText(current.name, dx, g.y + 77, dw, 32, 'left');
            textStyle(b, 16, subtitle);
            b.drawText(current.itypeId === 2 ? '重要物品' : '道具', dx,
                g.y + 111, dw, 24, 'left');
            textStyle(b, 17, dark);
            var desc = current.description || '尚無說明。';
            var lines = wrapText(b, desc, dw, 5);
            for (var l = 0; l < lines.length; l++) {
                b.drawText(lines[l], dx, g.y + 145 + l * 25, dw, 24, 'left');
            }
            var key = archiveKeyFromItem(current);
            if (key) {
                // 玩家仍在原本的「探索背包」，只在此加入典藏入口。
                var bx = dx, by = g.y + 234, bh = 43;
                b.fillRect(bx, by, dw, bh, '#366b59');
                b.fillRect(bx + 2, by + 2, dw - 4, bh - 4, '#3e7966');
                textStyle(b, 17, '#fffdf5');
                b.drawText(archiveOpen() ? '開啟信件典藏　›' : '請先啟用 XY_LetterArchive',
                           bx + 8, by + 6, dw - 16, 31, 'center');
                if (archiveOpen()) {
                    this._archiveButton = {x:bx, y:by, w:dw, h:bh, key:key};
                }
            }
            var imageName = imageFromItem(current);
            if (imageName) {
                textStyle(b, 14, subtitle);
                b.drawText(key ? '信件預覽 · 點擊可放大照片' : '點擊下方照片，可放大閱讀',
                    dx, g.y + g.h - 40, dw, 22, 'center');
                this.detailPicture.bitmap = ImageManager.loadPicture(imageName);
                this.detailPicture.visible = true;
                this.detailPicture._mapMode = false;
                this.detailPicture._archivePreview = !!key;
                this.fitPicture();
            } else {
                textStyle(b, 15, subtitle);
                b.drawText(key ? '（尚未設定信件照片）' : '（此道具未設定照片）', dx,
                    g.y + g.h - 84, dw, 24, 'left');
            }
        }
        this._listSignature = inventorySignature(all);
    };
    ExploreUi.prototype.fitPicture = function() {
        var img = this.detailPicture;
        if (!img.visible || !img.bitmap || !img.bitmap.isReady()) return;
        var g = this._geometry;
        var x, y, w, h;
        if (img._mapMode) {
            x = g.x + 22; y = g.y + 55;
            w = g.w - 44; h = g.h - 99;
        } else {
            var leftW = Math.max(190, Math.floor(g.w * 0.35));
            x = g.x + leftW + 40;
            if (img._archivePreview) {
                // 信件保留按鈕位置，把照片縮成下面的小預覽。
                y = g.y + Math.min(300, Math.floor(g.h * 0.55));
                h = g.y + g.h - 68 - y;
            } else {
                y = g.y + Math.min(290, g.h * 0.49);
                h = g.y + g.h - 44 - y;
            }
            w = g.w - leftW - 60;
        }
        if (w <= 0 || h <= 0) return;
        var scale = Math.min(w / img.bitmap.width, h / img.bitmap.height, 1);
        if (!isFinite(scale) || scale <= 0) return;
        img.scale.x = scale;
        img.scale.y = scale;
        img.x = Math.floor(x + (w - img.bitmap.width * scale) / 2);
        img.y = Math.floor(y + (h - img.bitmap.height * scale) / 2);
    };
    ExploreUi.prototype.openArchiveItem = function(item) {
        var key = archiveKeyFromItem(item);
        if (!key || !archiveOpen()) return false;
        // 讓典藏視窗蓋在原背包上；返回時直接顯示原背包。
        var opened = window.XYLetterArchive.open(key);
        if (opened) {
            if (typeof TouchInput !== 'undefined' && TouchInput.clear) TouchInput.clear();
            return true;
        }
        return false;
    };

    ExploreUi.prototype.handlePanelTouch = function(px, py) {
        var g = this._geometry;
        if (!g) return;
        // Close button
        if (inside(px, py, g.x + g.w - 65, g.y + 5, 60, 48)) {
            SoundManager.playCancel();
            if (this.overlayMode === 'photo') {
                this.overlayMode = 'bag'; this.redrawOverlay();
            } else {
                this.close();
            }
            return;
        }
        if (this.overlayMode !== 'bag') return;
        var all = items();
        var leftW = Math.max(190, Math.floor(g.w * 0.35));
        var start = this.listPage * 6;
        for (var i = 0; i < 6 && i + start < all.length; i++) {
            var iy = g.y + 70 + i * 59;
            if (inside(px, py, g.x + 13, iy, leftW, 49)) {
                var wasSelected = this.selected === i + start;
                this.selected = i + start;
                // 點選同一封信第二次，也可直接開啟典藏。
                if (wasSelected && this.openArchiveItem(all[this.selected])) {
                    SoundManager.playOk();
                    return;
                }
                SoundManager.playCursor();
                this.redrawOverlay();
                return;
            }
        }
        if (this._archiveButton && inside(px, py, this._archiveButton.x,
                  this._archiveButton.y, this._archiveButton.w, this._archiveButton.h)) {
            if (this.openArchiveItem(all[this.selected])) SoundManager.playOk();
            return;
        }
        // 保留原本「點照片放大」功能，不影響非信件物品。
        if (all[this.selected]) {
            var imageName = imageFromItem(all[this.selected]);
            var dx = g.x + leftW + 20;
            var dw = g.w - leftW - 38;
            if (imageName && inside(px, py, dx,
                g.y + 245, dw, g.h - 278)) {
                this._photoFile = imageName;
                this.overlayMode = 'photo';
                SoundManager.playOk();
                this.redrawOverlay();
                return;
            }
        }
        if (inside(px, py, g.x + 12, g.y + g.h - 58, 92, 34)) {
            if (this.listPage > 0) {
                this.listPage--; this.selected = this.listPage * 6;
                SoundManager.playCursor(); this.redrawOverlay();
            }
            return;
        }
        if (inside(px, py, g.x + leftW - 75, g.y + g.h - 58, 100, 34)) {
            if ((this.listPage + 1) * 6 < all.length) {
                this.listPage++; this.selected = this.listPage * 6;
                SoundManager.playCursor(); this.redrawOverlay();
            }
        }
    };
    ExploreUi.prototype.update = function() {
        this.updatePositions();
        // HTML 典藏視窗開啟時，暫停原背包的 Esc/滑鼠判斷。
        // 否則按 Esc 返回典藏時，原背包會被同時關閉。
        if (archiveIsOpen()) return;
        var busy = messageBusy(this.scene);
        if (busy && this.overlayMode) this.close();
        if (this.overlayMode && !unlocked()) this.close();
        this.room.visible = !busy && !!this._roomName && !this.overlayMode;
        this.mapButton.visible = !busy && unlocked() && !this.overlayMode;
        this.bagButton.visible = !busy && unlocked() && !this.overlayMode;
        if (this.overlayMode) {
            this.fitPicture();
            if (this.overlayMode === 'bag') {
                var sig = inventorySignature(items());
                if (sig !== this._listSignature) this.redrawOverlay();
            }
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                SoundManager.playCancel();
                if (this.overlayMode === 'photo') {
                    this.overlayMode = 'bag'; this.redrawOverlay();
                } else {
                    this.close();
                }
                return;
            }
            if (TouchInput.isTriggered()) {
                this.handlePanelTouch(TouchInput.x, TouchInput.y);
            }
        } else if (!busy && unlocked() && TouchInput.isTriggered()) {
            if (inside(TouchInput.x, TouchInput.y,
                this.mapButton.x, this.mapButton.y, 92, 36)) {
                SoundManager.playOk(); this.open('map');
            } else if (inside(TouchInput.x, TouchInput.y,
                this.bagButton.x, this.bagButton.y, 92, 36)) {
                SoundManager.playOk(); this.open('bag');
            }
        }
    };

    var _sceneCreateDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _sceneCreateDisplayObjects.call(this);
        this._whoseExploreUi = new ExploreUi(this);
    };
    var _sceneUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _sceneUpdate.call(this);
        if (this._whoseExploreUi) this._whoseExploreUi.update();
    };
    var _sceneProcessMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        var ui = this._whoseExploreUi;
        if (ui && (ui.overlayMode || ui.buttonHit(TouchInput.x, TouchInput.y))) {
            $gameTemp.clearDestination();
            return;
        }
        _sceneProcessMapTouch.call(this);
    };
    var _sceneIsMenuCalled = Scene_Map.prototype.isMenuCalled;
    Scene_Map.prototype.isMenuCalled = function() {
        if (this._whoseExploreUi && this._whoseExploreUi.overlayMode) return false;
        return _sceneIsMenuCalled.call(this);
    };
    var _playerCanMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        var scene = currentScene();
        if (scene && scene._whoseExploreUi && scene._whoseExploreUi.overlayMode) {
            return false;
        }
        return _playerCanMove.call(this);
    };
})();
