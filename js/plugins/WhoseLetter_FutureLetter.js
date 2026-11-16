//=============================================================================
// WhoseLetter_FutureLetter.js  |  v1.1.0  |  RPG Maker MV
// 《Whose letter?》寫給未來的自己：遊戲內書信、即時預覽、PNG 本機下載
//=============================================================================
/*:
 * @plugindesc v1.1.0 遊戲內撰寫給未來的信、下載 PNG，並以開關通知事件顯示結局；不傳送信件內容。
 * @author Whose letter? 專案（ChatGPT 協助製作）
 *
 * @param MaxBodyLength
 * @text 信件內容字數上限
 * @type number
 * @min 100
 * @max 10000
 * @default 3500
 *
 * @param DownloadSwitchId
 * @text PNG 已下載提示開關
 * @desc 開啟書信視窗時 OFF；成功產生 PNG 並發起下載時 ON；下載後修改內容則恢復 OFF。建議 #0061；0 表示不使用。
 * @type switch
 * @default 61
 *
 * @param ConfirmBeforeClose
 * @text 尚未下載時離開要提醒
 * @type boolean
 * @on 是
 * @off 否
 * @default true
 *
 * @help
 * ============================================================================
 * 安裝方法
 * ============================================================================
 * 1. 複製本檔至遊戲「原始專案」的 js/plugins/ 資料夾。
 * 2. RPG Maker MV → 工具 → 插件管理器 → 加入 WhoseLetter_FutureLetter → ON。
 * 3. 在 EV016 的「寫給未來的自己」選項中，新增「插件指令」：
 *
 *       FutureLetter open
 *
 * 4. 在插件管理器把「PNG 已下載提示開關」設為 #0061（或其他未使用開關）。
 * 5. 在「FutureLetter open」後面新增條件分歧：若 #0061 = ON，顯示結局圖片。
 * 6. 測試版與正式部署版都要測試：中文輸入、下載 PNG、關閉返回遊戲。
 *
 * ============================================================================
 * 功能與隱私
 * ============================================================================
 * - 玩家不會跳轉網址；在目前遊戲畫面上方出現書信編輯視窗。
 * - 預設使用開關 #0061：開啟書信時 OFF；產生 PNG 並觸發下載後 ON。
 * - 若下載後修改稱呼、內文或署名，開關會再設為 OFF，提醒重下最新版本。
 * - 「ON」僅表示已觸發下載；瀏覽器無法確認檔案是否真的儲存到裝置。
 * - `FutureLetter open` 會等待介面關閉後才繼續後續事件指令。
 * - 書寫稱呼、信件內容、署名；四個生命主題提供可插入引導句。
 * - 即時信紙預覽，點選「下載 PNG」後，在玩家裝置產生圖片。
 * - 無 Email 欄位、無 Google Apps Script、無 Google Sheets、無遠端提交。
 * - 不使用 localStorage、不保存信件文字；僅更新一個完成狀態開關。
 * - 使用者的遊戲網址可能有站台日誌；本插件本身不送出信件文字。
 * - 不提供自動寄信，沒有十年後寄送功能。
 *
 * ============================================================================
 * 使用提醒
 * ============================================================================
 * - RPG Maker MV 插件指令大小寫不拘：FutureLetter open
 * - 可由事件「腳本」呼叫：WhoseLetterFutureLetter.open();
 * - 支援 Windows (NW.js) 及網頁版；下載行為依瀏覽器／系統設定而異。
 * - 若從舊事件移除外部網址，請刪除 window.open(...) 那一行。
 * - 無需加入其他 HTML/CSS/圖片；本 .js 即包含所需畫面。
 * ============================================================================
 */
(function() {
    'use strict';
    var params = (typeof PluginManager !== 'undefined') ? PluginManager.parameters('WhoseLetter_FutureLetter') : {};
    var MAX_BODY = Math.max(100, Math.min(10000, Number(params.MaxBodyLength || 3500) || 3500));
    var CONFIRM_CLOSE = String(params.ConfirmBeforeClose || 'true') !== 'false';
    var DOWNLOAD_SWITCH_ID = Math.max(0, Math.floor(Number(params.DownloadSwitchId !== undefined ? params.DownloadSwitchId : 61) || 0));

    function markDownloadState(downloaded) {
        if (DOWNLOAD_SWITCH_ID > 0 && typeof $gameSwitches !== 'undefined' && $gameSwitches) {
            $gameSwitches.setValue(DOWNLOAD_SWITCH_ID, !!downloaded);
        }
    }

    function invalidateDownload() {
        if (!current) return;
        current.downloadStarted = false;
        markDownloadState(false);
    }
    var STYLE_ID = 'wlf-future-letter-style-v1';
    var current = null;
    var keyListener = null;
    var lastFocus = null;

    var STYLES = [
        '#wlf-overlay{position:fixed!important;left:0!important;right:0!important;top:0!important;bottom:0!important;z-index:2147483000!important;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(28,34,29,.84);font-family:"Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif;color:#3e443c;line-height:1.6;box-sizing:border-box;}',
        '#wlf-overlay *,#wlf-overlay *:before,#wlf-overlay *:after{box-sizing:border-box;}',
        '#wlf-overlay button,#wlf-overlay input,#wlf-overlay textarea{font-family:inherit;}',
        '#wlf-overlay .wlf-window{width:1080px;max-width:100%;max-height:calc(100vh - 24px);background:#f5f0e6;border:1px solid #c9b99e;border-radius:17px;box-shadow:0 20px 75px rgba(0,0,0,.47);display:flex;flex-direction:column;overflow:hidden;}',
        '#wlf-overlay .wlf-header{flex:none;padding:15px 22px 13px;background:linear-gradient(115deg,#fff9ed,#e5ecdf);border-bottom:1px solid #d7cdbc;display:flex;align-items:center;gap:16px;justify-content:space-between;}',
        '#wlf-overlay .wlf-kicker{font-size:11px;color:#84917f;letter-spacing:1.5px;font-weight:bold;}',
        '#wlf-overlay .wlf-heading{font-size:22px;color:#315647;letter-spacing:1px;font-weight:bold;margin-top:1px;}',
        '#wlf-overlay .wlf-close{border:1px solid #cfbd9f;border-radius:8px;background:#fffcf5;color:#6a665b;padding:6px 12px;cursor:pointer;font-size:13px;font-weight:bold;flex:none;}',
        '#wlf-overlay .wlf-close:hover{background:#eee3d2;}',
        '#wlf-overlay .wlf-contents{display:grid;grid-template-columns:minmax(290px,.92fr) minmax(290px,1.08fr);gap:14px;padding:15px;overflow:auto;min-height:0;}',
        '#wlf-overlay .wlf-panel{background:#fffdf8;border:1px solid #e4dccf;border-radius:12px;padding:18px;min-width:0;}',
        '#wlf-overlay .wlf-panel-title{font-size:15px;font-weight:bold;color:#3c5b49;margin-bottom:5px;}',
        '#wlf-overlay .wlf-sub{color:#7c796c;font-size:12px;margin-bottom:10px;}',
        '#wlf-overlay .wlf-label{display:block;color:#4a5b4d;font-weight:bold;font-size:12px;margin:11px 0 5px;}',
        '#wlf-overlay .wlf-field{display:block;width:100%;padding:9px 11px;border:1px solid #d8cfbf;border-radius:8px;background:#fffdf6;color:#363c34;outline:none;font-size:14px;line-height:1.65;}',
        '#wlf-overlay .wlf-field:focus{border-color:#678f7b;box-shadow:0 0 0 2px rgba(82,132,102,.14);}',
        '#wlf-overlay textarea.wlf-field{resize:vertical;min-height:165px;height:180px;}',
        '#wlf-overlay .wlf-count{text-align:right;font-size:11px;color:#908b7e;}',
        '#wlf-overlay .wlf-prompts{display:flex;gap:5px;flex-wrap:wrap;margin:8px 0 8px;}',
        '#wlf-overlay .wlf-chip{border:1px solid #cfddd2;border-radius:999px;background:#edf3ec;color:#436953;cursor:pointer;padding:6px 9px;font-size:11px;line-height:1.35;}',
        '#wlf-overlay .wlf-chip:hover{background:#d9e8da;}',
        '#wlf-overlay .wlf-preview-wrap{background:#e7dfce;border:1px solid #dacdb8;border-radius:10px;padding:10px;}',
        '#wlf-overlay .wlf-paper{position:relative;background:repeating-linear-gradient(to bottom,transparent 0 33px,rgba(142,147,133,.12) 34px,transparent 35px),#fffaf0;min-height:310px;border:1px solid #e1d9c7;padding:26px 24px 27px 37px;box-shadow:0 3px 10px rgba(94,74,45,.10);overflow-wrap:anywhere;line-height:2;}',
        '#wlf-overlay .wlf-paper:before{content:"";position:absolute;top:0;bottom:0;left:26px;width:1px;background:rgba(207,141,141,.24);}',
        '#wlf-overlay .wlf-stamp{position:absolute;right:12px;top:10px;border:1px solid #98a995;color:#7e957f;border-radius:50%;width:52px;height:52px;font-size:9px;text-align:center;line-height:1.4;padding-top:12px;transform:rotate(10deg);opacity:.7;}',
        '#wlf-overlay .wlf-paper-head{color:#7e917d;font-size:10px;letter-spacing:1px;margin-bottom:26px;}',
        '#wlf-overlay .wlf-paper-to{font-size:15px;color:#4f5042;font-weight:bold;padding-right:55px;}',
        '#wlf-overlay .wlf-paper-body{white-space:pre-wrap;min-height:120px;color:#48463d;font-size:13px;line-height:2;}',
        '#wlf-overlay .wlf-muted{color:#a4a294!important;}',
        '#wlf-overlay .wlf-paper-sign,#wlf-overlay .wlf-paper-date{text-align:right;color:#6e6658;}',
        '#wlf-overlay .wlf-paper-sign{font-size:13px;margin-top:12px;white-space:pre-wrap;}',
        '#wlf-overlay .wlf-paper-date{font-size:11px;}',
        '#wlf-overlay .wlf-download{display:block;width:100%;margin-top:12px;min-height:42px;border-radius:9px;background:#496e60;border:1px solid #496e60;color:#fff;font-weight:bold;font-size:14px;cursor:pointer;}',
        '#wlf-overlay .wlf-download:hover{background:#345a4b;}',
        '#wlf-overlay .wlf-download:disabled{opacity:.55;cursor:default;}',
        '#wlf-overlay .wlf-note{font-size:11px;color:#6c786d;margin-top:12px;line-height:1.8;background:#f0f5ed;border:1px solid #d9e5d7;border-radius:8px;padding:9px 11px;}',
        '#wlf-overlay .wlf-footer{flex:none;background:#eee6d8;padding:9px 17px;border-top:1px solid #d9ccba;display:flex;gap:8px;align-items:center;justify-content:space-between;color:#7b766b;font-size:11px;}',
        '#wlf-overlay .wlf-status{min-height:18px;color:#416950;font-size:12px;line-height:1.5;}',
        '#wlf-overlay .wlf-confirm{display:none;position:absolute;inset:0;background:rgba(23,32,26,.75);align-items:center;justify-content:center;padding:12px;z-index:2;}',
        '#wlf-overlay .wlf-confirm.wlf-visible{display:flex;}',
        '#wlf-overlay .wlf-dialog{max-width:390px;width:100%;background:#fffaf0;border:1px solid #ddcdb5;border-radius:14px;padding:22px;box-shadow:0 10px 35px #0004;color:#4c4a41;}',
        '#wlf-overlay .wlf-dialog-title{font-size:18px;font-weight:bold;color:#3e5a4a;margin-bottom:8px;}',
        '#wlf-overlay .wlf-dialog-body{font-size:13px;margin-bottom:18px;line-height:1.8;}',
        '#wlf-overlay .wlf-dialog-actions{display:flex;gap:10px;justify-content:flex-end;}',
        '#wlf-overlay .wlf-action{border:1px solid #cdbda2;background:#fff;color:#4d6055;border-radius:7px;padding:8px 12px;font-size:13px;cursor:pointer;}',
        '#wlf-overlay .wlf-action.wlf-danger{background:#936a56;color:white;border-color:#936a56;}',
        '@media(max-width:760px){#wlf-overlay{padding:6px}#wlf-overlay .wlf-window{max-height:calc(100vh - 12px)}#wlf-overlay .wlf-contents{grid-template-columns:1fr;padding:9px;gap:9px}#wlf-overlay .wlf-header{padding:10px 13px}#wlf-overlay .wlf-heading{font-size:18px}#wlf-overlay .wlf-panel{padding:12px}#wlf-overlay .wlf-paper{min-height:250px}#wlf-overlay textarea.wlf-field{min-height:130px;height:145px}}',
        '@media(max-height:540px){#wlf-overlay .wlf-header{padding:8px 12px}#wlf-overlay .wlf-contents{padding:8px}#wlf-overlay .wlf-panel{padding:11px}#wlf-overlay textarea.wlf-field{min-height:105px;height:110px}}'
    ].join('\n');

    function createEl(tag, className, text) {
        var el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined && text !== null) el.textContent = String(text);
        return el;
    }

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;
        var style = createEl('style');
        style.id = STYLE_ID;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(STYLES));
        document.head.appendChild(style);
    }

    function clearGameInput() {
        if (typeof Input !== 'undefined' && Input.clear) Input.clear();
        if (typeof TouchInput !== 'undefined' && TouchInput.clear) TouchInput.clear();
    }

    function pad2(n) { return n < 10 ? '0' + n : '' + n; }
    function today() {
        var d = new Date();
        return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }
    function todayForFilename() {
        var d = new Date();
        return '' + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate());
    }
    function fields() {
        if (!current) return null;
        return {
            to: current.to.value.trim() || '親愛的未來的我',
            body: current.message.value.trim(),
            from: current.from.value.trim() || '現在的自己'
        };
    }
    function countChars(text) {
        return Array.from ? Array.from(text).length : text.length;
    }

    function updatePreview() {
        if (!current) return;
        var d = fields();
        current.pTo.textContent = d.to + '：';
        current.pBody.textContent = d.body || '從此刻開始，留下一段想對未來自己說的話……';
        current.pBody.classList.toggle('wlf-muted', !d.body);
        current.pFrom.textContent = '—— ' + d.from;
        current.pDate.textContent = '寫於 ' + today();
        current.counter.textContent = countChars(current.message.value) + ' 字（上限 ' + MAX_BODY + '）';
        current.download.disabled = !d.body || current.busy;
    }

    function setStatus(text, isError) {
        if (!current) return;
        current.status.textContent = text;
        current.status.style.color = isError ? '#a45443' : '#416950';
    }

    function codepoints(text) {
        if (Array.from) return Array.from(text);
        return String(text).split('');
    }

    function wrapCanvasText(ctx, text, font, maxW) {
        ctx.font = font;
        var out = [];
        var parts = String(text).replace(/\r\n/g, '\n').split('\n');
        for (var p = 0; p < parts.length; p++) {
            if (!parts[p]) { out.push(''); continue; }
            var chars = codepoints(parts[p]);
            var line = '';
            for (var j = 0; j < chars.length; j++) {
                if (line && ctx.measureText(line + chars[j]).width > maxW) {
                    out.push(line);
                    line = chars[j];
                } else {
                    line += chars[j];
                }
            }
            out.push(line);
        }
        return out;
    }

    function drawLetter(d) {
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        if (!ctx) throw new Error('無法啟動圖片繪製功能。');
        var W = 960;
        var scale = 2;
        var margin = 90;
        var avail = W - 2 * margin;
        var fontName = '"Noto Serif TC","Microsoft JhengHei","PingFang TC",serif';
        var fBody = '29px ' + fontName;
        var fTo = 'bold 35px ' + fontName;
        var fSign = '29px ' + fontName;
        var bodyLines = wrapCanvasText(ctx, d.body, fBody, avail);
        var toLines = wrapCanvasText(ctx, d.to + '：', fTo, avail - 100);
        var fromLines = wrapCanvasText(ctx, '—— ' + d.from, fSign, avail);
        var bodyTop = 295 + Math.max(0, toLines.length - 1) * 50;
        var lineHeight = 52;
        var bodyBottom = bodyTop + bodyLines.length * lineHeight;
        var H = Math.max(1230, bodyBottom + 120 + fromLines.length * 44 + 120);
        if (H * scale > 26000) throw new Error('文字內容過長，無法產生單張圖片。請稍微縮短後再試。');
        c.width = W * scale;
        c.height = H * scale;
        ctx.scale(scale, scale);
        ctx.fillStyle = '#e8e0cf'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fffaf0'; ctx.fillRect(23, 23, W - 46, H - 46);
        ctx.strokeStyle = '#d8cdb8'; ctx.lineWidth = 2; ctx.strokeRect(23, 23, W - 46, H - 46);
        ctx.strokeStyle = '#eacdc9'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(73, 55); ctx.lineTo(73, H - 55); ctx.stroke();
        ctx.strokeStyle = 'rgba(140,151,136,.18)';
        for (var y = 170; y < H - 65; y += lineHeight) {
            ctx.beginPath(); ctx.moveTo(45, y); ctx.lineTo(W - 45, y); ctx.stroke();
        }
        ctx.fillStyle = '#718873'; ctx.font = '20px "Microsoft JhengHei",sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('寫給未來的自己  ·  WHOSE LETTER?', margin, 112);
        ctx.save(); ctx.translate(W - 145, 105); ctx.rotate(.16);
        ctx.strokeStyle = '#a6b7a1'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 46, 0, 2 * Math.PI); ctx.stroke();
        ctx.fillStyle = '#799179'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('WHOSE', 0, -6); ctx.fillText('LETTER?', 0, 14); ctx.restore();
        ctx.fillStyle = '#3e443c'; ctx.textAlign = 'left'; ctx.font = fTo;
        for (var i = 0; i < toLines.length; i++) ctx.fillText(toLines[i], margin, 211 + i * 50);
        ctx.font = fBody;
        for (i = 0; i < bodyLines.length; i++) if (bodyLines[i]) ctx.fillText(bodyLines[i], margin, bodyTop + i * lineHeight);
        var signY = Math.max(bodyBottom + 82, H - 100 - fromLines.length * 44 - 40);
        ctx.textAlign = 'right'; ctx.font = fSign;
        for (i = 0; i < fromLines.length; i++) ctx.fillText(fromLines[i], W - margin, signY + i * 44);
        ctx.fillStyle = '#7b867b'; ctx.font = '19px "Microsoft JhengHei",sans-serif';
        ctx.fillText('寫於 ' + today(), W - margin, signY + fromLines.length * 44 + 10);
        return c;
    }

    function clickDownload(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 30000);
    }

    function downloadPNG() {
        if (!current || current.busy) return;
        var d = fields();
        if (!d.body) {
            setStatus('請先寫下想對未來自己說的話。', true);
            current.message.focus();
            return;
        }
        var canvas;
        try {
            canvas = drawLetter(d);
        } catch (e) {
            setStatus('圖片製作失敗：' + (e && e.message ? e.message : '請再試一次。'), true);
            return;
        }
        var target = current;
        target.busy = true;
        updatePreview();
        setStatus('正在製作 PNG…', false);
        function success(blob) {
            if (current !== target) return;
            target.busy = false;
            updatePreview();
            if (!blob) {
                setStatus('圖片產生失敗。請再試一次。', true);
                return;
            }
            try {
                clickDownload(blob, '寫給未來的自己_' + todayForFilename() + '.png');
                target.downloadStarted = true;
                markDownloadState(true);
                setStatus('已啟動 PNG 下載！關閉介面後將進入結局。請確認圖片已保存。', false);
            } catch (e) {
                setStatus('無法啟動下載：' + (e && e.message ? e.message : '請檢查瀏覽器下載權限。'), true);
            }
        }
        if (canvas.toBlob) {
            try {
                canvas.toBlob(success, 'image/png');
            } catch (e) {
                target.busy = false;
                updatePreview();
                setStatus('圖片產生失敗，請嘗試縮短信件內容。', true);
            }
        } else {
            // Very old NW.js fallback. The large data URL is used only if toBlob is unavailable.
            try {
                var link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = '寫給未來的自己_' + todayForFilename() + '.png';
                document.body.appendChild(link); link.click(); document.body.removeChild(link);
                target.downloadStarted = true;
                markDownloadState(true);
                setStatus('已啟動 PNG 下載！關閉介面後將進入結局。請確認圖片已保存。', false);
            } catch (e2) {
                setStatus('下載失敗：請檢查瀏覽器或改用較短的信件內容。', true);
            }
            target.busy = false;
            updatePreview();
        }
    }

    function reallyClose() {
        if (!current) return;
        var wasRoot = current.root;
        if (keyListener) window.removeEventListener('keydown', keyListener, true);
        if (wasRoot.parentNode) wasRoot.parentNode.removeChild(wasRoot);
        current = null;
        keyListener = null;
        clearGameInput();
        if (lastFocus && typeof lastFocus.focus === 'function') {
            try { lastFocus.focus(); } catch (e) { /* ignored */ }
        }
        lastFocus = null;
    }

    function requestClose() {
        if (!current) return;
        if (current.confirmIsVisible) {
            current.confirmIsVisible = false;
            current.confirm.classList.remove('wlf-visible');
            return;
        }
        var hasWriting = !!current.message.value.trim();
        if (CONFIRM_CLOSE && hasWriting && !current.downloadStarted) {
            current.confirmIsVisible = true;
            current.confirm.classList.add('wlf-visible');
            current.cancelClose.focus();
        } else {
            reallyClose();
        }
    }

    function open() {
        if (current) return true;
        if (typeof document === 'undefined' || !document.body) return false;
        ensureStyle();
        lastFocus = document.activeElement;
        clearGameInput();
        var root = createEl('div');
        root.id = 'wlf-overlay';
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-label', '寫給未來的自己');
        root.innerHTML = [
            '<div class="wlf-window">',
              '<div class="wlf-header"><div><div class="wlf-kicker">WHOSE LETTER? · 故事的最後一封信</div><div class="wlf-heading">寫給未來的自己</div></div>',
              '<button class="wlf-close" type="button" id="wlf-close-btn">✕ 返回遊戲</button></div>',
              '<div class="wlf-contents">',
                '<section class="wlf-panel" aria-label="撰寫信件">',
                  '<div class="wlf-panel-title">把此刻的心意留給未來的自己</div>',
                  '<div class="wlf-sub">不必寫得完美，沒有標準答案。只有你自己會保存這封信。</div>',
                  '<label class="wlf-label" for="wlf-to">信件稱呼</label>',
                  '<input class="wlf-field" id="wlf-to" type="text" maxlength="60" autocomplete="off" value="親愛的未來的我">',
                  '<label class="wlf-label" for="wlf-message">信件內容</label>',
                  '<textarea class="wlf-field" id="wlf-message" placeholder="如果有一天你重新讀到這封信，希望你還記得……" autocomplete="off"></textarea>',
                  '<div class="wlf-count" id="wlf-count"></div>',
                  '<div class="wlf-label">不知道怎麼寫？可以點選引導句</div>',
                  '<div class="wlf-prompts">',
                    '<button type="button" class="wlf-chip" data-wlf-insert="今天，我想記得的一份感謝是……">道謝 · 一份感謝</button>',
                    '<button type="button" class="wlf-chip" data-wlf-insert="我希望未來的自己，仍記得如何關心身邊的人……">道愛 · 一份關心</button>',
                    '<button type="button" class="wlf-chip" data-wlf-insert="有件事我想慢慢學會理解與原諒……">道歉 · 一份理解</button>',
                    '<button type="button" class="wlf-chip" data-wlf-insert="面對改變與離別，我希望自己能……">道別 · 一份勇氣</button>',
                  '</div>',
                  '<label class="wlf-label" for="wlf-from">署名</label>',
                  '<input class="wlf-field" id="wlf-from" type="text" maxlength="50" placeholder="現在的自己" autocomplete="off">',
                  '<div class="wlf-note">🔒 此插件不收集 Email、不上傳文字，也不將信件存入遊戲存檔。關閉後內容會清空，請記得先下載 PNG。</div>',
                '</section>',
                '<section class="wlf-panel" aria-label="信件預覽">',
                  '<div class="wlf-panel-title">你的信件預覽</div>',
                  '<div class="wlf-sub">完成後點擊下方按鈕，在自己的裝置收藏這封信。</div>',
                  '<div class="wlf-preview-wrap"><div class="wlf-paper">',
                    '<div class="wlf-stamp">WHOSE<br>LETTER?</div>',
                    '<div class="wlf-paper-head">寫給未來的自己 · WHOSE LETTER?</div>',
                    '<div class="wlf-paper-to" id="wlf-preview-to"></div>',
                    '<div class="wlf-paper-body" id="wlf-preview-body"></div>',
                    '<div class="wlf-paper-sign" id="wlf-preview-from"></div>',
                    '<div class="wlf-paper-date" id="wlf-preview-date"></div>',
                  '</div></div>',
                  '<button class="wlf-download" id="wlf-download" type="button">↓ 下載信件 PNG</button>',
                  '<div class="wlf-note">圖片在目前裝置中產生，不需要連結 Google Sheets；關閉或重新整理遊戲後，未下載的內容無法恢復。</div>',
                '</section>',
              '</div>',
              '<div class="wlf-footer"><span>四封信，一段人生。願這封信陪伴未來的你。</span><span class="wlf-status" id="wlf-status" aria-live="polite"></span></div>',
            '</div>',
            '<div class="wlf-confirm" id="wlf-confirm" role="alertdialog" aria-label="確認離開">',
              '<div class="wlf-dialog">',
                '<div class="wlf-dialog-title">確定離開嗎？</div>',
                '<div class="wlf-dialog-body">這封信還沒有啟動 PNG 下載。離開後內容將會清空，無法恢復。</div>',
                '<div class="wlf-dialog-actions">',
                  '<button class="wlf-action" id="wlf-keep" type="button">繼續寫信</button>',
                  '<button class="wlf-action wlf-danger" id="wlf-discard" type="button">離開並清空</button>',
                '</div>',
              '</div>',
            '</div>'
        ].join('');
        document.body.appendChild(root);
        markDownloadState(false);
        function find(selector) { return root.querySelector(selector); }
        current = {
            root: root,
            to: find('#wlf-to'), message: find('#wlf-message'), from: find('#wlf-from'),
            pTo: find('#wlf-preview-to'), pBody: find('#wlf-preview-body'),
            pFrom: find('#wlf-preview-from'), pDate: find('#wlf-preview-date'),
            counter: find('#wlf-count'), download: find('#wlf-download'),
            status: find('#wlf-status'), confirm: find('#wlf-confirm'),
            cancelClose: find('#wlf-keep'), busy: false,
            confirmIsVisible: false, downloadStarted: false
        };
        current.message.maxLength = MAX_BODY;
        current.to.addEventListener('input', updatePreview);
        current.from.addEventListener('input', updatePreview);
        current.message.addEventListener('input', function() {
            // The current letter changed; a prior PNG download is no longer the final draft.
            invalidateDownload();
            updatePreview();
        });
        current.to.addEventListener('input', invalidateDownload);
        current.from.addEventListener('input', invalidateDownload);
        find('#wlf-close-btn').addEventListener('click', requestClose);
        find('#wlf-discard').addEventListener('click', reallyClose);
        current.cancelClose.addEventListener('click', function() {
            if (!current) return;
            current.confirmIsVisible = false;
            current.confirm.classList.remove('wlf-visible');
            current.message.focus();
        });
        current.download.addEventListener('click', downloadPNG);
        var chips = root.querySelectorAll('[data-wlf-insert]');
        for (var i = 0; i < chips.length; i++) {
            chips[i].addEventListener('click', function() {
                if (!current) return;
                var insert = this.getAttribute('data-wlf-insert');
                var box = current.message;
                var start = box.selectionStart || 0;
                var end = box.selectionEnd || 0;
                var pre = (box.value && start === box.value.length) ? '\n\n' : '';
                var next = box.value.slice(0, start) + pre + insert + box.value.slice(end);
                if (next.length > MAX_BODY) { setStatus('已達字數上限。', true); return; }
                box.value = next;
                box.focus();
                box.selectionStart = box.selectionEnd = start + pre.length + insert.length;
                invalidateDownload();
                updatePreview();
                setStatus('已加入引導句，你可以自由修改。', false);
            });
        }
        // RPG Maker MV usually listens for keyboard input on document. Capture at window
        // so native textarea IME (including Traditional Chinese) receives the keys, not the game.
        keyListener = function(e) {
            if (!current) return;
            if ((e.key === 'Escape' || e.keyCode === 27) && !e.isComposing && e.keyCode !== 229) {
                e.preventDefault();
                requestClose();
            }
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        };
        window.addEventListener('keydown', keyListener, true);
        var stopTypes = ['keyup', 'keypress', 'mousedown', 'mouseup', 'click', 'touchstart', 'touchend', 'wheel'];
        for (i = 0; i < stopTypes.length; i++) {
            root.addEventListener(stopTypes[i], function(e) { e.stopPropagation(); }, false);
        }
        updatePreview();
        try { current.message.focus(); } catch (e) { /* ignored */ }
        return true;
    }

    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _pluginCommand.call(this, command, args);
        if (String(command || '').toLowerCase() !== 'futureletter') return;
        var action = String(args[0] || 'open').toLowerCase();
        if (action === 'open') {
            if (open()) this.setWaitMode('wlfFutureLetter');
        } else if (action === 'close') {
            reallyClose();
        }
    };

    var _updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function() {
        if (this._waitMode === 'wlfFutureLetter') {
            if (current) return true;
            this._waitMode = '';
            return false;
        }
        return _updateWaitMode.call(this);
    };

    // Prevent the player from moving while composing a letter.
    var _canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return !current && _canMove.call(this);
    };

    // Remove HTML overlay if another event forces a map scene change.
    var _mapTerminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        if (current) reallyClose();
        _mapTerminate.call(this);
    };

    window.WhoseLetterFutureLetter = {
        open: open,
        close: requestClose,
        isOpen: function() { return !!current; },
        version: '1.1.0'
    };
})();
