//=============================================================================
// XY_LetterArchive.js
// 美術信件典藏：道具 → 信件 → 閱讀信件／查看反思 (RPG Maker MV)
//=============================================================================
/*:
 * @plugindesc v1.1 郵局生命反思 RPG：在「道具」中收藏信件、看圖片、回顧 Borton 三階段反思（支援四封信）
 * @author ChatGPT / OpenAI（依專案需求製作）
 *
 * @param Thanks Item ID
 * @text 道謝之信－道具 ID（可填 0 改用備註標籤）
 * @type number
 * @min 0
 * @default 0
 *
 * @param Thanks Picture
 * @text 道謝之信－照片檔名（不含 .png）
 * @desc 優先讀取道具備註 <LetterPicture:檔名>，若未寫則使用此參數。
 * @default
 *
 * @param Thanks What Var
 * @text 道謝－What 回答變數
 * @type variable
 * @default 3
 *
 * @param Thanks So Var
 * @text 道謝－So What 回答變數
 * @type variable
 * @default 4
 *
 * @param Thanks Now Var
 * @text 道謝－Now What 回答變數
 * @type variable
 * @default 5
 *
 * @param Thanks Switch
 * @text 道謝－反思完成開關
 * @type switch
 * @default 22
 *
 * @param Apology Item ID
 * @text 道歉之信－道具 ID（0 = 使用備註標籤）
 * @type number
 * @min 0
 * @default 0
 *
 * @param Apology Picture
 * @text 道歉之信－照片檔名（不含 .png）
 * @default
 *
 * @param Apology What Var
 * @text 道歉－What 回答變數（尚未製作可留 0）
 * @type number
 * @min 0
 * @default 0
 *
 * @param Apology So Var
 * @text 道歉－So What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Apology Now Var
 * @text 道歉－Now What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Apology Switch
 * @text 道歉－反思完成開關
 * @type number
 * @min 0
 * @default 0
 *
 * @param Love Item ID
 * @text 道愛之信－道具 ID（0 = 使用備註標籤）
 * @type number
 * @min 0
 * @default 0
 *
 * @param Love Picture
 * @text 道愛之信－照片檔名（不含 .png）
 * @default
 *
 * @param Love What Var
 * @text 道愛－What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Love So Var
 * @text 道愛－So What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Love Now Var
 * @text 道愛－Now What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Love Switch
 * @text 道愛－反思完成開關
 * @type number
 * @min 0
 * @default 0
 *
 * @param Farewell Item ID
 * @text 道別之信－道具 ID（0 = 使用備註標籤）
 * @type number
 * @min 0
 * @default 0
 *
 * @param Farewell Picture
 * @text 道別之信－照片檔名（不含 .png）
 * @default
 *
 * @param Farewell What Var
 * @text 道別－What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Farewell So Var
 * @text 道別－So What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Farewell Now Var
 * @text 道別－Now What 回答變數
 * @type number
 * @min 0
 * @default 0
 *
 * @param Farewell Switch
 * @text 道別－反思完成開關
 * @type number
 * @min 0
 * @default 0
 *
 * @help
 * ============================================================================
 * XY_LetterArchive.js － RPG Maker MV / v1.1
 * ============================================================================
 * 【用途】玩家在「道具／重要道具」選取信件，出現精美信紙介面：
 *   ①「閱讀信件」：顯示 img/pictures 中你原本的信件照片。
 *   ②「反思」：以唯讀模式顯示 What?／So What?／Now What? 的原始回答。
 *   ③「返回道具」：回到原本的道具清單。
 *
 * 【與先前插件的關係】
 *   保留原本的 XY_BortonReflection.js！該插件負責「填寫反思」，
 *   本插件只負責從道具中「閱讀與回顧」，不會覆蓋、清除或修改回答。
 *   兩個插件都設 ON 即可，先後順序不限。
 *
 * 【建立道謝之信道具】
 *  1. 資料庫(F9) → 道具 → 找一個空白 ID → 名稱填「道謝之信」。
 *  2. 道具類型設為「重要道具」，使用場合可設為「無」。
 *  3. 備註欄寫入：
 *       <LetterArchive:thanks>
 *       <LetterPicture:道謝之信>
 *     第二行「道謝之信」請改成你 img/pictures 內的真實照片檔名，
 *     不包含 .png 副檔名。如果暫時沒有照片，可先省略第二行。
 *  4. 道具給玩家後，在選單的「道具 → 重要道具」選到它即可。
 *
 * 【取得道具：修改 EV006】
 *  在基隆市 EV006 顯示最終照片之後新增「增減道具：道謝之信 + 1」。
 *  為避免多次閱讀重複得到道具，請用條件分歧「道具：道謝之信」
 *  判斷是否已持有；只有未持有時才新增。
 *  也可以使用插件命令：LetterArchive give thanks
 *  （自動檢查有沒有持有，不會重複增加）。
 *
 * 【原有反思資料】
 *  道謝之信：變數 #0003 What、#0004 So What、#0005 Now What；
 *            開關 #0022 是否完成。這些編號和先前插件預設一致。
 *  如果你已在 XY_BortonReflection.js 改過編號，請一併修改本插件參數。
 *  沒有填寫的題目會顯示「尚未留下反思」，仍可以查看其他回答。
 *  本插件「只讀」，無法從道具畫面改變反思文字。
 *
 * 【預留另外三封信】
 *  道歉之信：<LetterArchive:apology>
 *  道愛之信：<LetterArchive:love>
 *  道別之信：<LetterArchive:farewell>
 *  各信件需使用不同的三個變數與完成開關，在插件參數中設定。
 *  未設定的變數 (0) 不會讀取遊戲資料。
 *
 * 【插件命令（選用）】
 *  LetterArchive give thanks     取得道謝之信（若尚未持有）
 *  LetterArchive give apology    取得道歉之信
 *  LetterArchive give love       取得道愛之信
 *  LetterArchive give farewell   取得道別之信
 *  LetterArchive open thanks     直接從地圖開啟道謝之信典藏介面
 *  LetterArchive open apology    開啟道歉之信典藏介面
 *  LetterArchive open love       開啟道愛之信典藏介面
 *  LetterArchive open farewell   開啟道別之信典藏介面
 *
 * 【備註】
 *  ‧ 道具一定要先加入隊伍道具清單，玩家才能從道具選單查看。
 *  ‧ 本插件可使「使用場合：無」的重要道具仍可被選取來查看。
 *  ‧ 閱讀圖片透過 RPG Maker MV ImageManager.loadPicture 讀取。
 *  ‧ 反思文字仍保存在遊戲變數；請玩家正常存檔，才能在下次讀檔看到。
 *  ‧ 針對桌面版 RPG Maker MV (NW.js) 設計；手機與其他選單插件請另測。
 *  ‧ 先備份專案，並請務必使用同一份遊戲存檔測試前後回顧。
 * ============================================================================
 */

(function() {
    'use strict';
    var PLUGIN = 'XY_LetterArchive';
    var p = PluginManager.parameters(PLUGIN) || {};
    function intParam(key, value) {
        var n = parseInt(p[key], 10);
        return isFinite(n) && n >= 0 ? n : value;
    }
    function strParam(key) { return String(p[key] || '').trim(); }
    function tValue(variableId) {
        if (!variableId || typeof $gameVariables === 'undefined' || !$gameVariables) return '';
        var v = $gameVariables.value(variableId);
        return v === null || v === undefined || v === 0 ? '' : String(v);
    }
    var prompts = {
        thanks: [
            '回想一次你曾受到他人幫助或陪伴的經歷，當時發生了什麼事情？',
            '這段經歷為什麼讓你印象深刻？對你產生了什麼影響？',
            '這次經驗會如何影響你未來與他人相處的方式？'
        ],
        apology: [
            '回想一次你曾想向他人道歉的經歷，當時發生了什麼事情？',
            '那段經歷讓你產生什麼感受？你從中理解了什麼？',
            '未來遇到類似情況時，你希望採取什麼行動？'
        ],
        love: [
            '回想一次你曾經表達或感受到愛的經歷，當時發生了什麼事情？',
            '這段經歷對你與重要他人的關係有什麼意義？',
            '未來你想如何向重要的人表達關心與愛？'
        ],
        farewell: [
            '回想一次你曾面對離別的經歷，當時發生了什麼事情？',
            '這次離別帶給你什麼感受或新的理解？',
            '這些體會將如何影響你未來面對改變與珍惜關係的方式？'
        ]
    };
    var def = {
        thanks:   { title: '道謝之信', seal: '謝', idPrefix: 'Thanks',   vars: [3, 4, 5], switchId: 22 },
        apology:  { title: '道歉之信', seal: '歉', idPrefix: 'Apology',  vars: [0, 0, 0], switchId: 0 },
        love:     { title: '道愛之信', seal: '愛', idPrefix: 'Love',     vars: [0, 0, 0], switchId: 0 },
        farewell: { title: '道別之信', seal: '別', idPrefix: 'Farewell', vars: [0, 0, 0], switchId: 0 }
    };
    var entries = {};
    Object.keys(def).forEach(function(key) {
        var d = def[key], prefix = d.idPrefix;
        entries[key] = {
            key: key,
            title: d.title,
            seal: d.seal,
            itemId: intParam(prefix + ' Item ID', 0),
            picture: strParam(prefix + ' Picture'),
            variableIds: [intParam(prefix + ' What Var', d.vars[0]), intParam(prefix + ' So Var', d.vars[1]), intParam(prefix + ' Now Var', d.vars[2])],
            switchId: intParam(prefix + ' Switch', d.switchId),
            questions: prompts[key]
        };
    });

    function itemTag(item) {
        if (!item || !item.note) return '';
        var match = /<LetterArchive\s*:\s*(thanks|apology|love|farewell)\s*>/i.exec(item.note);
        return match ? match[1].toLowerCase() : '';
    }
    function findEntry(item) {
        if (!item || !DataManager.isItem(item)) return null;
        var tag = itemTag(item);
        if (tag) return entries[tag];
        var keys = Object.keys(entries);
        for (var i = 0; i < keys.length; i++) {
            var entry = entries[keys[i]];
            if (entry.itemId > 0 && entry.itemId === item.id) return entry;
        }
        return null;
    }
    function findItem(key) {
        if (!entries[key]) return null;
        if (entries[key].itemId > 0 && $dataItems && $dataItems[entries[key].itemId])
            return $dataItems[entries[key].itemId];
        if (!$dataItems) return null;
        for (var i = 1; i < $dataItems.length; i++) {
            var item = $dataItems[i];
            if (item && itemTag(item) === key) return item;
        }
        return null;
    }
    function pictureName(item, entry) {
        var match = item && item.note && /<LetterPicture\s*:\s*([^>\r\n]+)>/i.exec(item.note);
        var pic = match ? match[1].trim() : entry.picture;
        return pic.replace(/\.png$/i, '').trim();
    }
    function clearGameInput() {
        if (typeof Input !== 'undefined' && Input.clear) Input.clear();
        if (typeof TouchInput !== 'undefined' && TouchInput.clear) TouchInput.clear();
    }
    function element(tag, cls, txt) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (txt !== undefined) e.textContent = String(txt);
        return e;
    }
    function button(cls, text, click) {
        var b = element('button', 'xla-button ' + cls, text);
        b.type = 'button';
        b.addEventListener('click', click);
        return b;
    }

    var STYLE_ID = 'xla-style';
    var STYLE = [
        '.xla-overlay{position:fixed;left:0;top:0;right:0;bottom:0;z-index:999998;background:rgba(19,28,30,.84);display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:16px;font-family:"Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif;color:#3a423b;}',
        '.xla-overlay *{box-sizing:border-box;}',
        '.xla-paper{position:relative;width:786px;max-width:100%;max-height:calc(100vh - 32px);min-height:420px;overflow:hidden;display:flex;flex-direction:column;border:1px solid #e0cba9;border-radius:17px;background:#faf5e9;box-shadow:0 24px 75px rgba(0,0,0,.46);}',
        '.xla-paper:before{position:absolute;left:0;top:0;bottom:0;width:7px;background:#c5a06d;content:"";z-index:1;}',
        '.xla-paper:focus{outline:none;}',
        '.xla-head{display:flex;align-items:center;justify-content:space-between;padding:19px 27px 17px 32px;gap:16px;background:linear-gradient(110deg,#fff9ec,#ede2cd);border-bottom:1px solid #dfd0b5;flex:none;}',
        '.xla-caption{font-size:10px;font-weight:700;letter-spacing:2px;color:#a08462;margin-bottom:5px;}',
        '.xla-title{font-size:24px;font-weight:800;letter-spacing:1px;color:#374f47;line-height:1.4;}',
        '.xla-subtitle{font-size:12px;color:#8e806a;line-height:1.6;margin-top:5px;}',
        '.xla-seal{width:48px;height:48px;flex:0 0 48px;border:2px solid #af845d;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#9c7554;background:#f5e5cf;font-family:serif;font-size:24px;font-weight:700;}',
        '.xla-body{min-height:0;flex:1;overflow-y:auto;padding:22px 27px 20px 32px;}',
        '.xla-hero{display:flex;align-items:center;gap:18px;border:1px solid #dfd5c2;border-radius:14px;background:#fffdf7;padding:17px;margin-bottom:16px;}',
        '.xla-envelope{width:82px;height:78px;flex:0 0 82px;border-radius:10px;background:#f0e0c3;border:1px solid #dcc49d;display:flex;align-items:center;justify-content:center;color:#99784f;font-size:41px;box-shadow:inset 0 0 0 4px #faf1de;}',
        '.xla-hero-title{font-size:20px;color:#385d52;font-weight:800;margin-bottom:7px;}',
        '.xla-hero-text{font-size:13px;color:#827968;line-height:1.75;}',
        '.xla-section-title{font-size:13px;letter-spacing:1px;color:#74644c;font-weight:800;margin:15px 0 10px;}',
        '.xla-choice-grid{display:flex;flex-direction:row;gap:13px;}',
        '.xla-choice{flex:1;min-width:0;cursor:pointer;text-align:left;width:100%;border:1px solid #d9cfbb;border-radius:13px;padding:17px 16px;display:flex;flex-direction:column;gap:9px;background:#fffaf0;color:#3e564c;font:inherit;transition:background .15s,border-color .15s,transform .15s;}',
        '.xla-choice:hover,.xla-choice:focus{background:#f0f5ec;border-color:#8bad9b;transform:translateY(-1px);outline:none;}',
        '.xla-choice-icon{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:#e5eee7;color:#4b7968;font-size:22px;}',
        '.xla-choice-title{font-size:17px;font-weight:800;}',
        '.xla-choice-sub{font-size:12px;color:#82796a;line-height:1.7;}',
        '.xla-foot{display:flex;align-items:center;justify-content:space-between;flex:none;gap:10px;padding:12px 27px 14px 32px;border-top:1px solid #e2d6c0;background:#f4ebdc;}',
        '.xla-foot-note{font-size:11px;color:#94866f;line-height:1.55;}',
        '.xla-button{cursor:pointer;border:1px solid #c6b89e;border-radius:8px;padding:10px 15px;background:#fffbf2;font-family:inherit;color:#4e5a50;font-size:13px;font-weight:800;white-space:nowrap;}',
        '.xla-button:hover{background:#eee8db;}',
        '.xla-button:focus{outline:2px solid #79a58e;outline-offset:2px;}',
        '.xla-primary{border-color:#376e5d;background:#356a59;color:#fff;}',
        '.xla-primary:hover{background:#275546;}',
        '.xla-tabs{display:flex;gap:7px;margin:2px 0 17px;}',
        '.xla-tab{flex:1;min-width:0;white-space:normal;border:1px solid #ddd2bd;background:#f6f0e4;border-radius:9px;padding:11px 6px;font-size:12px;font-weight:800;color:#8c826e;cursor:pointer;font-family:inherit;}',
        '.xla-tab:hover{background:#edece1;}',
        '.xla-tab:focus{outline:2px solid #67937f;outline-offset:2px;}',
        '.xla-tab.xla-active{border-color:#80a491;background:#e3ede5;color:#305c4a;}',
        '.xla-label{font-size:12px;font-weight:800;color:#978164;letter-spacing:.6px;margin-bottom:6px;}',
        '.xla-question{font-size:17px;font-weight:700;color:#385448;line-height:1.65;margin-bottom:15px;}',
        '.xla-answer{background:#fffdfa;min-height:155px;max-height:270px;overflow:auto;border:1px solid #dacdb6;border-radius:12px;padding:17px;color:#3f4c44;font-size:15px;line-height:1.9;white-space:pre-wrap;word-break:break-word;overflow-wrap:break-word;}',
        '.xla-answer.xla-empty{color:#9b8e7a;font-style:italic;}',
        '.xla-status{display:inline-block;border-radius:50px;background:#e9f2ea;color:#51725e;padding:5px 11px;font-size:11px;font-weight:800;}',
        '.xla-status.xla-draft{background:#eee9db;color:#9d8161;}',
        '.xla-status-row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:13px;}',
        '.xla-photo-wrapper{border:1px solid #dccfb9;border-radius:12px;background:#e9dfcc;min-height:260px;display:flex;align-items:center;justify-content:center;padding:10px;overflow:auto;}',
        '.xla-photo{display:block;max-width:100%;max-height:calc(100vh - 260px);object-fit:contain;border:1px solid #d4c0a0;box-shadow:0 7px 20px rgba(60,45,20,.19);}',
        '.xla-photo-info{text-align:center;padding:35px 12px;font-size:14px;color:#867966;line-height:1.8;}',
        '.xla-crumb{font-size:12px;color:#9b8066;margin-bottom:10px;font-weight:700;}',
        '@media(max-width:560px){.xla-overlay{padding:7px}.xla-paper{min-height:0;max-height:calc(100vh - 14px)}.xla-head{padding:13px 15px 12px 21px}.xla-title{font-size:20px}.xla-seal{width:39px;height:39px;flex-basis:39px;font-size:19px}.xla-body{padding:14px 12px 12px 18px}.xla-foot{padding:10px 12px 11px 18px}.xla-hero{padding:11px}.xla-envelope{height:60px;width:62px;flex-basis:62px;font-size:30px}.xla-choice-grid{gap:8px}.xla-choice{padding:12px 10px}.xla-choice-title{font-size:15px}.xla-photo-wrapper{min-height:200px}.xla-answer{min-height:140px}.xla-tab{font-size:11px}}'
    ].join('\n');
    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;
        var style = element('style');
        style.id = STYLE_ID;
        style.appendChild(document.createTextNode(STYLE));
        document.head.appendChild(style);
    }
    var ui = {
        active: false, root: null, body: null, footer: null,
        item: null, entry: null, scene: null, mode: 'choose', step: 0,
        open: function(item, scene) {
            if (this.active || !item || !findEntry(item) || !document.body) return false;
            ensureStyle();
            this.active = true;
            this.item = item;
            this.entry = findEntry(item);
            this.scene = scene || null;
            this.mode = 'choose';
            this.step = 0;
            this.build();
            this.render();
            clearGameInput();
            return true;
        },
        build: function() {
            var self = this;
            var root = element('div', 'xla-overlay');
            root.setAttribute('role', 'presentation');
            var paper = element('div', 'xla-paper');
            paper.setAttribute('role', 'dialog');
            paper.setAttribute('aria-modal', 'true');
            paper.setAttribute('aria-label', this.entry.title + '典藏');
            paper.tabIndex = -1;
            var header = element('div', 'xla-head');
            var title = element('div');
            title.appendChild(element('div', 'xla-caption', 'LETTER ARCHIVE / 人生信件典藏'));
            title.appendChild(element('div', 'xla-title', this.item.name || this.entry.title));
            title.appendChild(element('div', 'xla-subtitle', '珍藏一封信，也留住自己寫下的感受。'));
            header.appendChild(title);
            header.appendChild(element('div', 'xla-seal', this.entry.seal));
            paper.appendChild(header);
            var body = element('div', 'xla-body');
            paper.appendChild(body);
            var footer = element('div', 'xla-foot');
            paper.appendChild(footer);
            root.appendChild(paper);
            document.body.appendChild(root);
            this.root = root;
            this.body = body;
            this.footer = footer;
            // Prevent keyboard strokes and taps in the HTML panel from also moving the game UI.
            ['keydown','keyup','keypress','mousedown','mouseup','touchstart','touchend','wheel'].forEach(function(name) {
                root.addEventListener(name, function(evt) {
                    if (name === 'keydown' && (evt.key === 'Escape' || evt.keyCode === 27) && !evt.isComposing && evt.keyCode !== 229) {
                        evt.preventDefault();
                        if (self.mode === 'choose') self.close(); else { self.mode = 'choose'; self.render(); }
                    }
                    evt.stopPropagation();
                });
            });
        },
        resetContent: function() {
            while (this.body.firstChild) this.body.removeChild(this.body.firstChild);
            while (this.footer.firstChild) this.footer.removeChild(this.footer.firstChild);
        },
        render: function() {
            if (!this.active) return;
            this.resetContent();
            if (this.mode === 'choose') this.renderChoose();
            else if (this.mode === 'photo') this.renderPhoto();
            else this.renderReview();
            this.body.scrollTop = 0;
            // RMMV handles Escape at document level. Keep focus inside the modal.
            var focusTarget = this.body.querySelector('.xla-choice, .xla-tab.xla-active') ||
                this.footer.querySelector('.xla-button') || this.root.querySelector('.xla-paper');
            if (focusTarget && focusTarget.focus) focusTarget.focus();
        },
        foot: function(note, label, handler) {
            this.footer.appendChild(element('span', 'xla-foot-note', note));
            var action = button('xla-primary', label, handler);
            this.footer.appendChild(action);
            return action;
        },
        renderChoose: function() {
            var self = this;
            var hero = element('div', 'xla-hero');
            hero.appendChild(element('div', 'xla-envelope', '✉'));
            var words = element('div');
            words.appendChild(element('div', 'xla-hero-title', this.item.name || this.entry.title));
            words.appendChild(element('div', 'xla-hero-text', this.item.description || '每封信都是生命中的一段回憶，也值得被重新閱讀。'));
            hero.appendChild(words);
            this.body.appendChild(hero);
            this.body.appendChild(element('div', 'xla-section-title', '想要回顧哪一部分？'));
            var cards = element('div', 'xla-choice-grid');
            function makeChoice(symbol, title, desc, mode) {
                var c = element('button', 'xla-choice');
                c.type = 'button';
                c.appendChild(element('span', 'xla-choice-icon', symbol));
                c.appendChild(element('span', 'xla-choice-title', title));
                c.appendChild(element('span', 'xla-choice-sub', desc));
                c.addEventListener('click', function() { self.mode = mode; self.render(); });
                return c;
            }
            cards.appendChild(makeChoice('✉', '閱讀信件', '再次翻閱這封信的完整照片。', 'photo'));
            cards.appendChild(makeChoice('✎', '查看反思', '回顧自己寫下的三階段生命反思。', 'review'));
            this.body.appendChild(cards);
            this.foot('這封信將保存在重要道具中，不會因閱讀而消失。', '返回道具', function() { self.close(); });
        },
        renderPhoto: function() {
            var self = this;
            this.body.appendChild(element('div', 'xla-crumb', '典藏 / 閱讀信件'));
            var wrapper = element('div', 'xla-photo-wrapper');
            var name = pictureName(this.item, this.entry);
            if (!name) {
                wrapper.appendChild(element('div', 'xla-photo-info', '目前尚未指定信件照片。\n請在道具備註加入 <LetterPicture:照片檔名>，或在插件參數設定照片檔名。'));
            } else {
                var hint = element('div', 'xla-photo-info', '正在展開信件……');
                wrapper.appendChild(hint);
                var bitmap = ImageManager.loadPicture(name);
                var rootNow = this.root;
                bitmap.addLoadListener(function() {
                    if (!self.active || self.root !== rootNow || self.mode !== 'photo') return;
                    if (!bitmap.width || !bitmap.height) { hint.textContent = '無法讀取照片：' + name; return; }
                    var img = element('img', 'xla-photo');
                    img.alt = self.entry.title + '照片';
                    // Bitmap.canvas is generated by the MV engine even for encrypted pictures.
                    try {
                        img.src = bitmap.canvas.toDataURL('image/png');
                    } catch (err) {
                        if (bitmap._image && bitmap._image.src) img.src = bitmap._image.src;
                    }
                    if (!img.src) { hint.textContent = '照片無法顯示，請確認 img/pictures 的檔名。'; return; }
                    img.addEventListener('error', function() {
                        if (hint.parentNode) hint.textContent = '無法顯示照片：' + name + '（請檢查檔案名稱）';
                        if (img.parentNode) img.parentNode.removeChild(img);
                    });
                    if (hint.parentNode) hint.parentNode.removeChild(hint);
                    wrapper.appendChild(img);
                });
            }
            this.body.appendChild(wrapper);
            this.foot('可重複閱讀，不會消耗道具。', '← 回信件選單', function() { self.mode = 'choose'; self.render(); });
        },
        renderReview: function() {
            var self = this;
            var names = ['What? · 經驗回顧', 'So What? · 經驗分析', 'Now What? · 未來行動'];
            // Follow the input plugin's per-letter questions/variable IDs/switch.
            // Fall back to this plugin's settings if the input plugin is absent.
            var bridge = window.XYBortonReflection;
            var q = bridge && typeof bridge.getQuestions === 'function' ? bridge.getQuestions(this.entry.key) : null;
            var ids = bridge && typeof bridge.getVariableIds === 'function' ? bridge.getVariableIds(this.entry.key) : null;
            var doneId = bridge && typeof bridge.getCompletionSwitch === 'function' ? bridge.getCompletionSwitch(this.entry.key) : 0;
            var questions = q && q.length === 3 ? q : this.entry.questions;
            var variables = ids && ids.length === 3 && ids.every(function(n) { return n > 0; }) ? ids : this.entry.variableIds;
            var switchId = doneId > 0 ? doneId : this.entry.switchId;
            this.body.appendChild(element('div', 'xla-crumb', '典藏 / 反思札記'));
            var statusRow = element('div', 'xla-status-row');
            statusRow.appendChild(element('div', 'xla-section-title', 'Borton 三階段反思'));
            var complete = switchId > 0 && $gameSwitches && $gameSwitches.value(switchId);
            statusRow.appendChild(element('span', 'xla-status' + (complete ? '' : ' xla-draft'), complete ? '✓ 已完成' : '尚未完成'));
            this.body.appendChild(statusRow);
            var tabs = element('div', 'xla-tabs');
            for (var i = 0; i < 3; i++) {
                (function(step) {
                    var tab = element('button', 'xla-tab' + (self.step === step ? ' xla-active' : ''), names[step]);
                    tab.type = 'button';
                    tab.addEventListener('click', function() { self.step = step; self.render(); });
                    tabs.appendChild(tab);
                })(i);
            }
            this.body.appendChild(tabs);
            this.body.appendChild(element('div', 'xla-label', '旁白當時提出的問題'));
            this.body.appendChild(element('div', 'xla-question', questions[this.step]));
            this.body.appendChild(element('div', 'xla-label', '你寫下的反思'));
            var ans = tValue(variables[this.step]);
            this.body.appendChild(element('div', 'xla-answer' + (ans.trim() ? '' : ' xla-empty'), ans.trim() ? ans : '尚未留下反思。完成對應關卡的反思後，就能在這裡回顧。'));
            this.foot('唯讀回顧模式：不會修改已儲存的文字。', '← 回信件選單', function() { self.mode = 'choose'; self.render(); });
        },
        close: function() {
            if (!this.active) return;
            var scene = this.scene;
            if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
            this.root = null;
            this.body = null;
            this.footer = null;
            this.item = null;
            this.entry = null;
            this.scene = null;
            this.active = false;
            clearGameInput();
            if (scene && SceneManager._scene === scene && scene._itemWindow) {
                if (scene.activateItemWindow) scene.activateItemWindow();
                else scene._itemWindow.activate();
            }
        }
    };

    // Let Important Items with Occasion: Never still be selectable in the Item scene.
    var _Window_ItemList_isEnabled = Window_ItemList.prototype.isEnabled;
    Window_ItemList.prototype.isEnabled = function(item) {
        if (item && findEntry(item) && typeof Scene_Item !== 'undefined' && SceneManager._scene instanceof Scene_Item &&
            $gameParty && $gameParty.hasItem(item, false)) return true;
        return _Window_ItemList_isEnabled.call(this, item);
    };

    // Avoid normal item use, item consumption, actor targeting or a common event.
    var _Scene_Item_onItemOk = Scene_Item.prototype.onItemOk;
    Scene_Item.prototype.onItemOk = function() {
        var item = this.item();
        if (item && findEntry(item) && $gameParty && $gameParty.hasItem(item, false)) {
            if ($gameParty.setLastItem) $gameParty.setLastItem(item);
            if (this._itemWindow) this._itemWindow.deactivate();
            ui.open(item, this);
            return;
        }
        _Scene_Item_onItemOk.call(this);
    };

    // Ensure HTML overlay is not left over when changing scenes.
    var _Scene_Item_terminate = Scene_Item.prototype.terminate;
    Scene_Item.prototype.terminate = function() {
        if (ui.active && ui.scene === this) ui.close();
        _Scene_Item_terminate.call(this);
    };
    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        if (ui.active && !ui.scene) ui.close();
        _Scene_Map_terminate.call(this);
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (String(command).toLowerCase() !== 'letterarchive') return;
        var action = String(args[0] || '').toLowerCase();
        var key = String(args[1] || 'thanks').toLowerCase();
        if (!entries[key]) return;
        var item = findItem(key);
        if (!item || !$gameParty) return;
        if (action === 'give') {
            if (!$gameParty.hasItem(item, false)) $gameParty.gainItem(item, 1);
        } else if (action === 'open') {
            if ($gameParty.hasItem(item, false) && ui.open(item, null)) this.setWaitMode('xyLetterArchive');
        }
    };
    var _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'xyLetterArchive') {
            if (ui.active) return true;
            this._waitMode = '';
            return false;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };

    // For optional manual debugging only; regular players do not need the console.
    window.XYLetterArchive = {
        isOpen: function() { return ui.active; },
        open: function(key) { var item = findItem(key || 'thanks'); return item ? ui.open(item, null) : false; },
        close: function() { ui.close(); }
    };
})();
