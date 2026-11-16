//=============================================================================
// XY_BortonReflection.js  |  v2.0  |  RPG Maker MV
// 四封信共用的 Borton 三階段反思手札（保留舊版儲存資料）
//=============================================================================
/*:
 * @plugindesc v2.0 四封信共用：道謝／道愛／道歉／道別，獨立題目、中文輸入、獨立回答與完成開關。相容舊版 open 指令。
 * @author ChatGPT / OpenAI（依專案需求製作）
 *
 * @param Journal Title
 * @text 道謝－手札標題（保留舊設定）
 * @default 道謝之信 · 反思手札
 *
 * @param Subtitle
 * @text 道謝－副標題（保留舊設定）
 * @default 有些溫暖，值得用文字好好保存。
 *
 * @param What Question
 * @text 道謝－What? 經驗回顧
 * @default 回想一次你曾受到他人幫助或陪伴的經歷，當時發生了什麼事情？
 *
 * @param So What Question
 * @text 道謝－So What? 經驗分析
 * @default 這段經歷為什麼讓你印象深刻？對你產生了什麼影響？
 *
 * @param Now What Question
 * @text 道謝－Now What? 未來行動
 * @default 這次經驗會如何影響你未來與他人相處的方式？
 *
 * @param What Variable
 * @text 道謝－What 回答變數
 * @type variable
 * @default 3
 *
 * @param So What Variable
 * @text 道謝－So What 回答變數
 * @type variable
 * @default 4
 *
 * @param Now What Variable
 * @text 道謝－Now What 回答變數
 * @type variable
 * @default 5
 *
 * @param Completed Switch
 * @text 道謝－反思完成開關
 * @type switch
 * @default 22
 *
 * @param Love Title
 * @text 道愛－手札標題
 * @default 道愛之信 · 反思手札
 *
 * @param Love Subtitle
 * @text 道愛－副標題
 * @default 那些藏在日常裡的關懷，值得好好記住。
 *
 * @param Love What Question
 * @text 道愛－What? 經驗回顧
 * @default 回想一次你曾感受到他人的愛與關懷，或主動向他人表達關心的經歷，當時發生了什麼事情？
 *
 * @param Love So What Question
 * @text 道愛－So What? 經驗分析
 * @default 這段經歷讓你對愛與關懷有什麼不同的理解？為什麼？
 *
 * @param Love Now What Question
 * @text 道愛－Now What? 未來行動
 * @default 未來你希望透過什麼具體行動，向生命中重要的人表達愛與關心？
 *
 * @param Love What Variable
 * @text 道愛－What 回答變數
 * @type variable
 * @default 17
 *
 * @param Love So What Variable
 * @text 道愛－So What 回答變數
 * @type variable
 * @default 18
 *
 * @param Love Now What Variable
 * @text 道愛－Now What 回答變數
 * @type variable
 * @default 19
 *
 * @param Love Completed Switch
 * @text 道愛－完成開關
 * @type switch
 * @default 36
 *
 * @param Apology Title
 * @text 道歉－手札標題
 * @default 道歉之信 · 反思手札
 *
 * @param Apology Subtitle
 * @text 道歉－副標題
 * @default 理解與修復，有時從願意面對開始。
 *
 * @param Apology What Question
 * @text 道歉－What? 經驗回顧
 * @default 回想一次你曾向他人道歉，或希望向他人表達歉意的經歷，當時發生了什麼事情？
 *
 * @param Apology So What Question
 * @text 道歉－So What? 經驗分析
 * @default 當時你和對方可能有哪些感受？這段經歷讓你理解了什麼？
 *
 * @param Apology Now What Question
 * @text 道歉－Now What? 未來行動
 * @default 未來如果發生誤會或傷害，你想如何表達歉意或修復關係？
 *
 * @param Apology What Variable
 * @text 道歉－What 回答變數
 * @type variable
 * @default 20
 *
 * @param Apology So What Variable
 * @text 道歉－So What 回答變數
 * @type variable
 * @default 21
 *
 * @param Apology Now What Variable
 * @text 道歉－Now What 回答變數
 * @type variable
 * @default 22
 *
 * @param Apology Completed Switch
 * @text 道歉－完成開關
 * @type switch
 * @default 37
 *
 * @param Farewell Title
 * @text 道別－手札標題
 * @default 道別之信 · 反思手札
 *
 * @param Farewell Subtitle
 * @text 道別－副標題
 * @default 有些告別，會讓我們更懂得珍惜。
 *
 * @param Farewell What Question
 * @text 道別－What? 經驗回顧
 * @default 回想一次你曾經歷告別或重要改變的時刻，當時發生了什麼事情？
 *
 * @param Farewell So What Question
 * @text 道別－So What? 經驗分析
 * @default 這次告別或改變對你有什麼意義？帶給你哪些感受或領悟？
 *
 * @param Farewell Now What Question
 * @text 道別－Now What? 未來行動
 * @default 這段體會會如何影響你未來珍惜人事物，或面對生活的改變？
 *
 * @param Farewell What Variable
 * @text 道別－What 回答變數
 * @type variable
 * @default 23
 *
 * @param Farewell So What Variable
 * @text 道別－So What 回答變數
 * @type variable
 * @default 24
 *
 * @param Farewell Now What Variable
 * @text 道別－Now What 回答變數
 * @type variable
 * @default 25
 *
 * @param Farewell Completed Switch
 * @text 道別－完成開關
 * @type switch
 * @default 38
 *
 * @param Max Characters
 * @text 每題文字上限（四封共用）
 * @type number
 * @min 100
 * @max 10000
 * @default 1500
 *
 * @help
 * ==========================================================================
 * 安裝：把這個檔案取代原來 js/plugins/XY_BortonReflection.js，
 *       不要額外增加第二個同名插件；先備份原檔及遊戲存檔。
 *
 * 道謝： BortonReflection open thanks
 * 道愛： BortonReflection open love
 * 道歉： BortonReflection open apology
 * 道別： BortonReflection open farewell
 *
 * 相容舊事件：BortonReflection open 仍會開啟「道謝」，不用修改 EV006。
 * 暫存續寫：下次使用相同 open 指令會顯示先前內容。
 * 回顧修改：BortonReflection review love  等同開啟該信反思。
 * 清除測試資料：BortonReflection reset love 只清除道愛；
 *              BortonReflection reset 不帶主題只清除道謝（慎用）。
 *
 * 預設獨立儲存：
 * 道謝 變數 3/4/5  開關 22（與舊版完全相同）
 * 道愛 變數 17/18/19  開關 36
 * 道歉 變數 20/21/22  開關 37
 * 道別 變數 23/24/25  開關 38
 * 請先確認未與你其他 RPG 事件占用的變數或開關衝突；若有，可
 * 於本插件與 XY_LetterArchive 的對應參數同步修改。
 *
 * 玩家按「稍後再寫」僅暫存、完成開關不會 ON。
 * 必須三題都填寫並按「完成反思」才會 ON；可從同一存檔回顧。
 * 文字使用 HTML textarea，支援繁體中文輸入法與多行換行。
 * 保存到磁碟仍需 RPG Maker MV 正常儲存遊戲存檔。
 *
 * 注意：道具裡的「反思」仍由 XY_LetterArchive.js 以唯讀顯示。
 * 建議同時安裝本套件附的典藏相容版本，讓回顧題目與輸入題目一致。
 * ==========================================================================
 */

(function() {
    'use strict';

    var NAME = 'XY_BortonReflection';
    var params = PluginManager.parameters(NAME) || {};

    function numberParam(key, fallback) {
        var raw = params[key];
        if (raw === undefined || raw === null || raw === '') return fallback;
        var value = Number(raw);
        return isFinite(value) && value > 0 ? Math.floor(value) : 0;
    }
    function strParam(key, fallback) {
        var val = params[key];
        return val === undefined || val === null || String(val).trim() === '' ? fallback : String(val);
    }
    function makeConfig(key, prefix, def) {
        var p = prefix ? prefix + ' ' : '';
        return {
            key: key,
            title: strParam(p + (prefix ? 'Title' : 'Journal Title'), def.title),
            subtitle: strParam(p + 'Subtitle', def.subtitle),
            seal: def.seal,
            completionText: def.completionText,
            questions: [
                strParam(p + 'What Question', def.questions[0]),
                strParam(p + 'So What Question', def.questions[1]),
                strParam(p + 'Now What Question', def.questions[2])
            ],
            variables: [numberParam(p + 'What Variable', def.vars[0]),
                        numberParam(p + 'So What Variable', def.vars[1]),
                        numberParam(p + 'Now What Variable', def.vars[2])],
            completionSwitch: numberParam(p + (prefix ? 'Completed Switch' : 'Completed Switch'), def.switchId),
            maxCharacters: Math.max(100, Math.min(10000, numberParam('Max Characters', 1500)))
        };
    }
    var configs = {
        thanks: makeConfig('thanks', '', {
            title: '道謝之信 · 反思手札', subtitle: '有些溫暖，值得用文字好好保存。', seal: '謝',
            completionText: '謝謝你留下這些真實的回憶與想法。願那些曾經被接住的時刻，也能成為你未來溫柔陪伴他人的力量。',
            questions: [
                '回想一次你曾受到他人幫助或陪伴的經歷，當時發生了什麼事情？',
                '這段經歷為什麼讓你印象深刻？對你產生了什麼影響？',
                '這次經驗會如何影響你未來與他人相處的方式？'
            ], vars: [3, 4, 5], switchId: 22
        }),
        love: makeConfig('love', 'Love', {
            title: '道愛之信 · 反思手札', subtitle: '那些藏在日常裡的關懷，值得好好記住。', seal: '愛',
            completionText: '或許愛不一定需要說出口，也可能藏在日常生活的小小關懷。謝謝你留下這段溫暖的體會。',
            questions: [
                '回想一次你曾感受到他人的愛與關懷，或主動向他人表達關心的經歷，當時發生了什麼事情？',
                '這段經歷讓你對愛與關懷有什麼不同的理解？為什麼？',
                '未來你希望透過什麼具體行動，向生命中重要的人表達愛與關心？'
            ], vars: [17, 18, 19], switchId: 36
        }),
        apology: makeConfig('apology', 'Apology', {
            title: '道歉之信 · 反思手札', subtitle: '理解與修復，有時從願意面對開始。', seal: '歉',
            completionText: '謝謝你認真面對這段經歷。理解自己的感受，也許就是修復關係的第一步。',
            questions: [
                '回想一次你曾向他人道歉，或希望向他人表達歉意的經歷，當時發生了什麼事情？',
                '當時你和對方可能有哪些感受？這段經歷讓你理解了什麼？',
                '未來如果發生誤會或傷害，你想如何表達歉意或修復關係？'
            ], vars: [20, 21, 22], switchId: 37
        }),
        farewell: makeConfig('farewell', 'Farewell', {
            title: '道別之信 · 反思手札', subtitle: '有些告別，會讓我們更懂得珍惜。', seal: '別',
            completionText: '謝謝你願意面對這些珍貴的記憶。願你能帶著這段體會，繼續珍惜往後的每一天。',
            questions: [
                '回想一次你曾經歷告別或重要改變的時刻，當時發生了什麼事情？',
                '這次告別或改變對你有什麼意義？帶給你哪些感受或領悟？',
                '這段體會會如何影響你未來珍惜人事物，或面對生活的改變？'
            ], vars: [23, 24, 25], switchId: 38
        })
    };
    function theme(key) { return configs[String(key || 'thanks').toLowerCase()] || null; }
    function usable(c) {
        if (!c || !c.completionSwitch || c.variables.some(function(id){ return !id; })) return false;
        return c.variables[0] !== c.variables[1] && c.variables[0] !== c.variables[2] && c.variables[1] !== c.variables[2];
    }

    var STAGES = [
        { name: 'What?', ch: '經驗回顧', code: '01', hint: '試著具體描述當時的人、事、時、地。', placeholder: '從那一天的經過開始，寫下你記得的事……' },
        { name: 'So What?', ch: '經驗分析', code: '02', hint: '想想那段經歷帶來的感受與意義。', placeholder: '這件事讓我感受到……' },
        { name: 'Now What?', ch: '未來行動', code: '03', hint: '試著寫下你未來想實際做出的行動。', placeholder: '未來當我遇到類似情況時，我想……' }
    ];

    var STYLE_ID = 'xy-borton-journal-style';
    var STYLE = [
        '.xyb-backdrop{position:fixed;z-index:999999;left:0;right:0;top:0;bottom:0;box-sizing:border-box;display:flex;align-items:center;justify-content:center;overflow:auto;padding:20px;background:rgba(16,25,29,.81);font-family:"Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif;color:#293e3d;}',
        '.xyb-backdrop *{box-sizing:border-box;}',
        '.xyb-paper{position:relative;width:760px;max-width:100%;max-height:calc(100vh - 40px);min-height:420px;display:flex;flex-direction:column;overflow:hidden;border:1px solid #ddc7a0;border-radius:17px;background:#faf6ed;box-shadow:0 18px 65px rgba(0,0,0,.42),0 0 0 5px rgba(255,255,255,.06);}',
        '.xyb-paper:before{content:"";position:absolute;top:0;left:0;bottom:0;width:7px;background:#d5aa69;z-index:1;}',
        '.xyb-header{padding:25px 31px 20px 36px;background:linear-gradient(110deg,#fff9ec,#efe5d1);border-bottom:1px solid #e4d6bb;flex:none;}',
        '.xyb-title-row{display:flex;align-items:center;justify-content:space-between;gap:14px;}',
        '.xyb-kicker{font-size:11px;letter-spacing:2px;color:#8e7054;font-weight:700;margin-bottom:7px;}',
        '.xyb-title{font-weight:800;font-size:23px;letter-spacing:1px;line-height:1.35;}',
        '.xyb-subtitle{font-size:13px;margin-top:5px;color:#776e5b;line-height:1.6;}',
        '.xyb-seal{width:50px;height:50px;line-height:47px;text-align:center;flex:0 0 50px;border-radius:50%;border:2px solid #bd8e66;box-shadow:inset 0 0 0 3px #f7ead5;color:#996f55;background:#f8edda;font-family:serif;font-size:24px;font-weight:700;}',
        '.xyb-body{padding:20px 30px 16px 36px;overflow-y:auto;flex:1;min-height:0;}',
        '.xyb-progress{display:flex;gap:9px;margin-bottom:19px;}',
        '.xyb-progress-item{flex:1;min-width:0;display:flex;align-items:center;gap:9px;padding:10px 12px;border:1px solid #dfd6c6;border-radius:10px;background:#f5f1e8;color:#948b7a;}',
        '.xyb-progress-item.xyb-current{background:#e7eee9;border-color:#9bb5a9;color:#285c52;box-shadow:inset 0 0 0 1px #c6d9ce;}',
        '.xyb-progress-item.xyb-finished{color:#55776b;background:#f0f5ed;}',
        '.xyb-progress-num{width:24px;height:24px;line-height:22px;text-align:center;border:1px solid currentColor;border-radius:50%;flex:0 0 24px;font-size:11px;font-weight:700;}',
        '.xyb-progress-label{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.xyb-stage{display:flex;align-items:center;gap:10px;color:#6c6e5e;font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:9px;}',
        '.xyb-stage-line{width:22px;height:2px;background:#c6ab7b;}',
        '.xyb-question{font-size:19px;font-weight:800;line-height:1.65;letter-spacing:.35px;color:#29423e;margin-bottom:5px;}',
        '.xyb-hint{font-size:12px;color:#908573;margin-bottom:15px;line-height:1.6;}',
        '.xyb-input-frame{position:relative;display:flex;flex-direction:column;min-height:164px;border:1px solid #cebfa7;border-radius:12px;background:#fffdfa;box-shadow:inset 0 1px 3px rgba(39,30,18,.05);overflow:hidden;}',
        '.xyb-input-frame.xyb-focused{border-color:#5b8e80;box-shadow:0 0 0 3px rgba(102,154,134,.15);}',
        '.xyb-textarea{display:block;width:100%;height:164px;min-height:150px;resize:vertical;border:0;outline:0;background:transparent;padding:14px 17px 5px;color:#30413b;font:16px/1.85 "Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif;letter-spacing:.15px;}',
        '.xyb-textarea::placeholder{color:#b0a79a;}',
        '.xyb-meta{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 15px 10px;color:#928979;font-size:11px;}',
        '.xyb-tip{min-height:20px;margin-top:7px;color:#ad5844;font-size:12px;line-height:1.5;}',
        '.xyb-footer{padding:13px 30px 16px 36px;display:flex;justify-content:space-between;align-items:center;gap:10px;border-top:1px solid #e6dccb;background:#f5eee2;flex:none;}',
        '.xyb-right{display:flex;gap:9px;align-items:center;}',
        '.xyb-btn{font-family:inherit;font-size:13px;font-weight:700;letter-spacing:.25px;white-space:nowrap;border-radius:9px;border:1px solid #c9bca8;padding:11px 16px;color:#4b5c56;background:#fffaf1;cursor:pointer;outline:none;}',
        '.xyb-btn:hover{background:#f5eedf;}',
        '.xyb-btn:focus{box-shadow:0 0 0 3px rgba(68,116,98,.18);}',
        '.xyb-btn:disabled{cursor:default;opacity:.45;}',
        '.xyb-primary{border-color:#326c5e;color:#fff;background:#326c5e;box-shadow:0 3px 8px rgba(19,79,63,.15);}',
        '.xyb-primary:hover{background:#235b4e;}',
        '.xyb-text-btn{border:0;background:none;color:#907b5c;padding:10px 2px;box-shadow:none;}',
        '.xyb-text-btn:hover{background:none;color:#594e3c;text-decoration:underline;}',
        '.xyb-complete{text-align:center;padding:25px 10px 19px;}',
        '.xyb-complete-mark{height:62px;width:62px;margin:0 auto 16px;border:2px solid #6f9b88;border-radius:50%;line-height:58px;font-size:33px;color:#3b7964;background:#e6f1e9;}',
        '.xyb-complete-title{font-weight:800;font-size:22px;color:#2d5449;}',
        '.xyb-complete-desc{font-size:14px;line-height:1.9;margin:12px auto 0;max-width:490px;color:#746c5c;}',
        '@media(max-width:600px){.xyb-backdrop{padding:8px}.xyb-paper{max-height:calc(100vh - 16px);min-height:0}.xyb-header{padding:16px 15px 14px 21px}.xyb-title{font-size:19px}.xyb-seal{width:40px;height:40px;line-height:37px;flex-basis:40px}.xyb-body{padding:15px 13px 10px 19px}.xyb-progress{gap:5px}.xyb-progress-item{padding:7px 4px;gap:3px;flex-direction:column;text-align:center}.xyb-progress-label{font-size:10px}.xyb-question{font-size:16px}.xyb-textarea{height:155px;font-size:15px}.xyb-footer{padding:10px 12px 12px 19px;gap:5px;flex-wrap:wrap}.xyb-btn{padding:9px 11px;font-size:12px}.xyb-right{gap:5px}.xyb-text-btn{padding:9px 2px}}'
    ].join('\n');

    function el(tag, cls, text) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (text !== undefined && text !== null) node.textContent = String(text);
        return node;
    }

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;
        var node = el('style');
        node.id = STYLE_ID;
        node.type = 'text/css';
        node.appendChild(document.createTextNode(STYLE));
        document.head.appendChild(node);
    }

    function valueAsText(variableId) {
        var stored = $gameVariables.value(variableId);
        return stored === undefined || stored === null || stored === 0 ? '' : String(stored);
    }

    function setStoredText(variableId, txt) {
        // MV's Game_Variables.setValue supports strings and stores them in save files.
        $gameVariables.setValue(variableId, String(txt));
    }

    function clearEngineInput() {
        if (typeof Input !== 'undefined' && Input.clear) Input.clear();
        if (typeof TouchInput !== 'undefined' && TouchInput.clear) TouchInput.clear();
    }

    var journal = {
        active: false,
        finishedScreen: false,
        step: 0,
        answers: ['', '', ''],
        root: null,
        elements: {},
        currentConfig: null,

        open: function(key) {
            var chosen = theme(key);
            if (!usable(chosen)) {
                if (typeof console !== 'undefined') console.warn('[XY_BortonReflection] 反思題組尚未正確設定：', key || 'thanks');
                return false;
            }
            if (this.active || !document.body || !$gameVariables || !$gameSwitches) return false;
            this.currentConfig = chosen;
            injectStyle();
            this.active = true;
            this.finishedScreen = false;
            this.step = 0;
            this.answers = [
                valueAsText(chosen.variables[0]),
                valueAsText(chosen.variables[1]),
                valueAsText(chosen.variables[2])
            ];
            this.build();
            this.render();
            clearEngineInput();
            var self = this;
            window.setTimeout(function() {
                if (self.active && self.elements.textarea) self.elements.textarea.focus();
            }, 40);
            return true;
        },

        build: function() {
            var self = this;
            var conf = this.currentConfig;
            var root = el('div', 'xyb-backdrop');
            root.setAttribute('role', 'presentation');
            var paper = el('div', 'xyb-paper');
            paper.setAttribute('role', 'dialog');
            paper.setAttribute('aria-modal', 'true');
            paper.setAttribute('aria-label', conf.title);
            var header = el('div', 'xyb-header');
            var row = el('div', 'xyb-title-row');
            var heading = el('div');
            heading.appendChild(el('div', 'xyb-kicker', 'A MOMENT TO REFLECT  /  生命反思'));
            heading.appendChild(el('div', 'xyb-title', conf.title));
            heading.appendChild(el('div', 'xyb-subtitle', conf.subtitle));
            row.appendChild(heading);
            row.appendChild(el('div', 'xyb-seal', conf.seal));
            header.appendChild(row);

            var body = el('div', 'xyb-body');
            var progress = el('div', 'xyb-progress');
            var progressItems = [];
            var i;
            for (i = 0; i < 3; i++) {
                var p = el('div', 'xyb-progress-item');
                p.appendChild(el('div', 'xyb-progress-num', STAGES[i].code));
                p.appendChild(el('div', 'xyb-progress-label', STAGES[i].ch));
                progress.appendChild(p);
                progressItems.push(p);
            }
            body.appendChild(progress);
            var questionPart = el('div', 'xyb-question-part');
            var stage = el('div', 'xyb-stage');
            stage.appendChild(el('span', 'xyb-stage-line'));
            var stageText = el('span', '', '');
            stage.appendChild(stageText);
            questionPart.appendChild(stage);
            var q = el('div', 'xyb-question');
            q.id = 'xyb-question-text';
            questionPart.appendChild(q);
            var hint = el('div', 'xyb-hint');
            questionPart.appendChild(hint);
            var frame = el('div', 'xyb-input-frame');
            var textarea = el('textarea', 'xyb-textarea');
            textarea.rows = 5;
            textarea.maxLength = conf.maxCharacters;
            textarea.setAttribute('aria-labelledby', q.id);
            textarea.spellcheck = false;
            frame.appendChild(textarea);
            var meta = el('div', 'xyb-meta');
            var saved = el('span', '', '輸入會暫存於遊戲變數');
            var count = el('span', '', '0 / ' + conf.maxCharacters + ' 字');
            meta.appendChild(saved);
            meta.appendChild(count);
            frame.appendChild(meta);
            questionPart.appendChild(frame);
            var tip = el('div', 'xyb-tip', '');
            tip.setAttribute('role', 'status');
            questionPart.appendChild(tip);
            body.appendChild(questionPart);
            var completion = el('div', 'xyb-complete');
            completion.style.display = 'none';
            completion.appendChild(el('div', 'xyb-complete-mark', '✓'));
            completion.appendChild(el('div', 'xyb-complete-title', '你已完成這段反思'));
            completion.appendChild(el('div', 'xyb-complete-desc', conf.completionText));
            body.appendChild(completion);

            var footer = el('div', 'xyb-footer');
            var later = el('button', 'xyb-btn xyb-text-btn', '稍後再寫');
            later.type = 'button';
            var right = el('div', 'xyb-right');
            var prev = el('button', 'xyb-btn', '← 上一題');
            prev.type = 'button';
            var next = el('button', 'xyb-btn xyb-primary', '下一題 →');
            next.type = 'button';
            right.appendChild(prev);
            right.appendChild(next);
            footer.appendChild(later);
            footer.appendChild(right);
            paper.appendChild(header);
            paper.appendChild(body);
            paper.appendChild(footer);
            root.appendChild(paper);
            document.body.appendChild(root);

            this.root = root;
            this.elements = {
                body: body, progressItems: progressItems, questionPart: questionPart,
                stage: stageText, question: q, hint: hint, frame: frame,
                textarea: textarea, saved: saved, count: count, tip: tip,
                completion: completion, later: later, prev: prev, next: next
            };

            textarea.addEventListener('input', function() {
                self.answers[self.step] = textarea.value;
                setStoredText(self.currentConfig.variables[self.step], textarea.value);
                if ((!self.answers[0].trim() || !self.answers[1].trim() || !self.answers[2].trim()) &&
                    $gameSwitches.value(self.currentConfig.completionSwitch)) {
                    $gameSwitches.setValue(self.currentConfig.completionSwitch, false);
                }
                self.elements.count.textContent = textarea.value.length + ' / ' + conf.maxCharacters + ' 字';
                self.elements.saved.textContent = '草稿已暫存（需正常存檔才會保留到下次遊戲）';
                self.elements.tip.textContent = '';
            });
            textarea.addEventListener('focus', function() { frame.className = 'xyb-input-frame xyb-focused'; });
            textarea.addEventListener('blur', function() { frame.className = 'xyb-input-frame'; });
            later.addEventListener('click', function() {
                if (self.finishedScreen) {
                    self.finishedScreen = false;
                    self.step = 0;
                    self.render();
                    self.elements.textarea.focus();
                } else {
                    self.close();
                }
            });
            prev.addEventListener('click', function() { self.previous(); });
            next.addEventListener('click', function() {
                if (self.finishedScreen) self.close();
                else self.next();
            });
            // Stop keystrokes in this native text input from reaching RPG Maker's controls.
            var stopNames = ['keydown', 'keyup', 'keypress', 'wheel', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
            for (i = 0; i < stopNames.length; i++) {
                root.addEventListener(stopNames[i], function(e) {
                    if (e.type === 'keydown' && (e.key === 'Escape' || e.keyCode === 27) && !e.isComposing && e.keyCode !== 229) {
                        e.preventDefault();
                        self.close();
                    }
                    e.stopPropagation();
                }, false);
            }
        },

        saveCurrent: function() {
            if (!this.active || this.finishedScreen || !this.currentConfig) return;
            var answer = this.elements.textarea.value;
            this.answers[this.step] = answer;
            setStoredText(this.currentConfig.variables[this.step], answer);
        },

        render: function() {
            var i;
            var conf = this.currentConfig;
            var meta = STAGES[this.step];
            var fields = this.elements;
            for (i = 0; i < 3; i++) {
                fields.progressItems[i].className = 'xyb-progress-item' +
                    (i === this.step ? ' xyb-current' : (this.answers[i].trim() ? ' xyb-finished' : ''));
            }
            fields.stage.textContent = meta.name + '  ·  ' + meta.ch;
            fields.question.textContent = conf.questions[this.step];
            fields.hint.textContent = meta.hint;
            fields.textarea.value = this.answers[this.step];
            fields.textarea.placeholder = meta.placeholder;
            fields.count.textContent = fields.textarea.value.length + ' / ' + conf.maxCharacters + ' 字';
            fields.tip.textContent = '';
            fields.prev.disabled = this.step === 0;
            fields.prev.style.display = '';
            fields.next.textContent = this.step === 2 ? '完成反思 ✓' : '下一題 →';
            fields.next.className = 'xyb-btn xyb-primary';
            fields.later.textContent = '稍後再寫';
            fields.questionPart.style.display = '';
            fields.completion.style.display = 'none';
            fields.body.scrollTop = 0;
        },

        previous: function() {
            this.saveCurrent();
            if (this.step > 0) {
                this.step--;
                this.render();
                this.elements.textarea.focus();
            }
        },

        next: function() {
            this.saveCurrent();
            if (!this.answers[this.step].trim()) {
                this.elements.tip.textContent = '請先寫下你的想法；如果想晚點再回答，可以按「稍後再寫」。';
                this.elements.textarea.focus();
                return;
            }
            if (this.step < 2) {
                this.step++;
                this.render();
                this.elements.textarea.focus();
                return;
            }
            if (!this.answers[0].trim() || !this.answers[1].trim() || !this.answers[2].trim()) {
                this.elements.tip.textContent = '三個階段都需要填寫，才能完成反思。';
                return;
            }
            $gameSwitches.setValue(this.currentConfig.completionSwitch, true);
            this.showComplete();
        },

        showComplete: function() {
            var fields = this.elements;
            this.finishedScreen = true;
            fields.questionPart.style.display = 'none';
            fields.completion.style.display = '';
            fields.prev.style.display = 'none';
            fields.next.textContent = '回到遊戲 →';
            fields.later.textContent = '回顧修改';
            fields.body.scrollTop = 0;
            fields.next.focus();
        },

        close: function() {
            if (!this.active) return;
            this.saveCurrent();
            if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
            this.active = false;
            this.finishedScreen = false;
            this.root = null;
            this.elements = {};
            this.currentConfig = null;
            clearEngineInput();
        },

        reset: function(key) {
            var c = theme(key);
            if (!usable(c) || !$gameVariables || !$gameSwitches) return false;
            if (this.active && this.currentConfig === c) this.close();
            for (var i = 0; i < 3; i++) setStoredText(c.variables[i], '');
            $gameSwitches.setValue(c.completionSwitch, false);
            return true;
        }
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (String(command).toLowerCase() !== 'bortonreflection') return;
        var sub = String(args[0] || 'open').toLowerCase();
        var key = String(args[1] || 'thanks').toLowerCase();
        if (sub === 'open' || sub === 'review') {
            if (journal.open(key)) this.setWaitMode('xyBortonReflection');
        } else if (sub === 'reset') {
            journal.reset(key);
        }
    };

    var _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'xyBortonReflection') {
            if (journal.active) return true;
            this._waitMode = '';
            return false;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };

    // Avoid leaving an HTML input overlay behind if another script changes scenes.
    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        if (journal.active) journal.close();
        _Scene_Map_terminate.call(this);
    };

    // Exposed for debugging from the F8 console, without global event command code.
    window.XYBortonReflection = {
        isOpen: function() { return journal.active; },
        open: function(key) { return journal.open(key || 'thanks'); },
        close: function() { journal.close(); },
        getQuestions: function(key) {
            var c = theme(key);
            return c ? c.questions.slice() : null;
        },
        getVariableIds: function(key) {
            var c = theme(key);
            return c ? c.variables.slice() : null;
        },
        getCompletionSwitch: function(key) {
            var c = theme(key);
            return c ? c.completionSwitch : 0;
        }
    };
})();
