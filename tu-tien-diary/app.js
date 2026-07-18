// --- API Key & State Management ---
let geminiApiKey = localStorage.getItem('gemini_api_key') || '';

// DOM Elements
const apiToggle = document.getElementById('apiToggle');
const apiBody = document.getElementById('apiBody');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const clearKeyBtn = document.getElementById('clearKeyBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

const mortalInput = document.getElementById('mortalInput');
const refineBtn = document.getElementById('refineBtn');
const magicCircle = document.getElementById('magicCircle');
const circleStatus = document.getElementById('circleStatus');

const immortalOutput = document.getElementById('immortalOutput');
const outputPlaceholder = document.getElementById('outputPlaceholder');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const toast = document.getElementById('toast');

// Chips for templates
const chips = document.querySelectorAll('.chip');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    updateApiStatus();
    if (geminiApiKey) {
        apiKeyInput.value = geminiApiKey;
    }
    
    // Set up template chips
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            mortalInput.value = chip.getAttribute('data-text');
            showToast('Linh hồn ký sự đã được nạp!', 'success');
        });
    });

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registered successfully!', reg.scope))
                .catch(err => console.log('Service Worker registration failed:', err));
        });
    }
});

// Toggle API settings
apiToggle.addEventListener('click', (e) => {
    // Prevent toggle if clicking buttons/input inside header if any
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    apiBody.classList.toggle('collapsed');
    const arrow = apiToggle.querySelector('.arrow-icon');
    arrow.textContent = apiBody.classList.contains('collapsed') ? '▼' : '▲';
});

// Save API Key
saveKeyBtn.addEventListener('click', () => {
    const newKey = apiKeyInput.value.trim();
    if (!newKey) {
        showToast('Vui lòng nhập Linh Thạch (API Key)!', 'error');
        return;
    }
    geminiApiKey = newKey;
    localStorage.setItem('gemini_api_key', newKey);
    updateApiStatus();
    showToast('Đã phong ấn thành công Linh Thạch (Lưu API Key)!', 'success');
    apiBody.classList.add('collapsed');
    apiToggle.querySelector('.arrow-icon').textContent = '▼';
});

// Clear API Key
clearKeyBtn.addEventListener('click', () => {
    geminiApiKey = '';
    apiKeyInput.value = '';
    localStorage.removeItem('gemini_api_key');
    updateApiStatus();
    showToast('Đã hủy ấn Linh Thạch (Xóa API Key)!', 'success');
});

function updateApiStatus() {
    if (geminiApiKey) {
        statusDot.className = 'dot pulse-green';
        statusText.textContent = 'Thần Lực Vô Song (Chế độ Trực Tuyến AI)';
    } else {
        statusDot.className = 'dot pulse-red';
        statusText.textContent = 'Linh Lực Suy Kiệt (Chế độ Ngoại Tuyến)';
    }
}

// --- Toast Notification Helper ---
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast';
    if (type === 'error') {
        toast.classList.add('error');
    }
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// --- Translation Magic ---

// Offline Cultivation Dictionary
const dictionary = [
    { keys: ['đi làm', 'đến công ty', 'tới công ty'], val: 'bắt đầu hành trình phó hội tông môn, tu hành tông vụ' },
    { keys: ['sếp', 'giám đốc', 'sếp tổng', 'trưởng phòng'], val: 'Tông chủ đại nhân hiển hách uy nghiêm' },
    { keys: ['mắng', 'chửi', 'quát', 'khiển trách'], val: 'phóng ra chí cao uy áp, thần niệm chấn áp đạo tâm' },
    { keys: ['kẹt xe', 'tắc đường', 'tắc xe'], val: 'linh chu ngự kiếm nghẽn nghẹt nơi hư không, vạn giới phi hành khí hỗn loạn cuồng bạo' },
    { keys: ['muộn', 'trễ'], val: 'chậm trễ cát nhật, bỏ lỡ thời khắc linh khí nồng đậm nhất' },
    { keys: ['đồng nghiệp', 'bạn cùng công ty'], val: 'đồng môn sư huynh đệ trong linh đạo' },
    { keys: ['ăn trưa', 'ăn cơm trưa', 'đi ăn'], val: 'nuốt tinh hoa linh quả, hấp thụ thiên địa trân bửu' },
    { keys: ['cà phê', 'cafe'], val: 'ngộ đạo thần dịch (Hắc Long trà)' },
    { keys: ['lỗi', 'bug', 'lỗi code'], val: 'tâm ma quấy phá linh trận linh văn, khiến trận pháp càn khôn điên đảo' },
    { keys: ['code', 'viết code', 'lập trình'], val: 'khắc họa phù văn thần trận, bố trí thiên cấp trận pháp' },
    { keys: ['tiền', 'lương', 'thanh toán'], val: 'cực phẩm linh thạch thượng cổ' },
    { keys: ['mệt', 'buồn ngủ', 'oải'], val: 'đạo cơ lay động, linh lực cạn kiệt, tâm ma thừa cơ đột nhập' },
    { keys: ['khóc', 'buồn', 'chán'], val: 'tâm ma phản phệ, thần hồn chấn động dữ dội' },
    { keys: ['ngủ', 'đi ngủ'], val: 'nhập định sâu, bế quan tu luyện ngàn năm' },
    { keys: ['quán ăn', 'quán cơm'], val: 'phồn hoa tiên lâu' },
    { keys: ['tính nhầm', 'nhầm hóa đơn'], val: 'linh trận thiên cơ điên đảo, tính toán linh khí xuất hiện dị thường' },
    { keys: ['cãi nhau', 'tranh cãi'], val: 'thi triển miệng lưỡi thần thông quyết chiến sinh tử' },
    { keys: ['mưa', 'mưa to'], val: 'thiên kiếp lôi vũ cuồng phong cuồn cuộn đổ xuống' },
    { keys: ['ngập', 'lụt'], val: 'bát hoang ngập lụt, thủy triều đại hoang nhấn chìm trần thế' },
    { keys: ['máy tính', 'laptop'], val: 'Pháp bảo Càn Khôn Kính' },
    { keys: ['điện thoại', 'alo'], val: 'truyền âm ngọc giản vạn dặm' },
    { keys: ['khách hàng', 'đối tác'], val: 'cổ xưa thế gia sứ giả' }
];

const prefixes = [
    "Ngửa mặt lên trời thét dài một tiếng, phun ra một ngụm tinh huyết, càn khôn đảo lộn, vạn cổ đại đạo nứt vỡ! Ta... ",
    "Nhìn thiên kiếp cuồn cuộn trên chín tầng mây, ta hít sâu một ngụm khí lạnh, đạo tâm lung lay sắp sụp đổ. Ta... ",
    "Vạn trượng lôi đình giáng thế, vạn linh gào thét phẫn nộ, ta biết kiếp số tu hành nghìn năm đã đến. Ta... ",
    "Trời xanh đổ máu, đại địa rung chuyển, cửu u chấn động. Giữa lúc sinh tử tồn vong chân đạp tinh không, ta... "
];

const suffixes = [
    " Thần hồn ta suýt chút nữa đã trực tiếp câu diệt, triệt để tiêu tán trong dòng sông lịch sử vạn cổ!",
    " Sự kiện kinh hoàng này trực tiếp kích hoạt nghịch thiên lôi kiếp, khiến ta cửu tử nhất sinh, suýt nữa hóa thành tro bụi!",
    " Chứng kiến cảnh tượng chấn kinh thiên địa này, chư thiên vạn giới cường giả đều đồng loạt hít vào một ngụm khí lạnh!",
    " Đúng là tự cổ chí kim nghịch thiên cải mệnh, đi ngược càn khôn đều phải chịu đựng những kiếp nạn chí cực bực này!"
];

// Offline Translation Engine
function translateOffline(text) {
    if (!text.trim()) return "Đạo hữu chưa nhập bất kỳ dòng nhật ký nào vào Phàm Nhân Bản!";

    let lowerText = text.toLowerCase();
    let translated = lowerText;

    // Apply dictionary mappings
    dictionary.forEach(item => {
        item.keys.forEach(key => {
            const regex = new RegExp(key, 'gi');
            translated = translated.replace(regex, item.val);
        });
    });

    // Capitalize sentences
    translated = translated.charAt(0).toUpperCase() + translated.slice(1);
    
    // Choose random embellishments
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${prefix}${translated}.${suffix}`;
}

// Online Gemini Translation Engine
async function translateOnline(text, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `Bạn là một dịch giả cổ trang tu tiên kỳ ảo vĩ đại. Hãy chuyển đổi đoạn nhật ký đời thường sau đây sang phong cách tu tiên mạng Trung Quốc theo các yêu cầu nghiêm ngặt sau:

PHONG CÁCH CHỦ ĐẠO:
- Kể chuyện giống tiểu thuyết tiên hiệp mạng Trung Quốc, kết hợp yếu tố hài hước, cường điệu và nghiêm túc hóa những việc nhỏ nhặt.
- Giọng văn cực kỳ nghiêm trọng, đầy sát khí, giống như chuẩn bị quyết chiến sinh tử của một chương mở đầu tiểu thuyết tu tiên.
- Độ dài kết quả dịch phải đạt ít nhất 150 từ.

QUY TẮC DỊCH THUẬT:
1. Giữ nguyên cốt truyện gốc và kết quả cuối cùng (Không tự bịa thêm cốt truyện mới hay thay đổi kết quả).
2. Không thêm nhân vật mới nếu không cần thiết.
3. Chỉ dịch/chuyển đổi cách diễn đạt sang thế giới tu tiên. Mỗi câu đều nên có cảm giác "đại chiến sinh tử".

THUẬT NGỮ BẮT BUỘC SỬ DỤNG (Hãy khéo léo lồng ghép nhiều từ nhất có thể):
Thiên địa, Linh khí, Thiên kiếp, Đại đạo, Thiên cơ, Khí vận, Chân nguyên, Kim Đan, Nguyên Anh, Độ kiếp, Bí pháp, Cấm thuật, Thần thức, Kiếm ý, Huyền công, Thiên tài địa bảo, Dị tượng, Thiên mệnh, Tông môn, Bí cảnh, Ma đầu, Tiên nhân, Hộ đạo, Thiên ngoại, Đạo tâm, Nhân quả, Luân hồi.

QUY TẮC CHUYỂN ĐỔI HÀI HƯỚC (Ví dụ):
- Uống nước → hấp thu linh dịch trời đất.
- Đi ngủ → bế quan dưỡng thần.
- Đi vệ sinh → bài xuất tạp chất sau khi đột phá cảnh giới.
- Rửa bát → luyện hóa cổ khí.
- Đi làm → tham gia đại hội tranh đoạt khí vận.
- Đi học → tiến vào Thánh Điện truyền đạo.
- Nấu mì → luyện chế linh thực.
- Hết tiền → linh thạch khô kiệt.
- Wifi yếu → thiên địa pháp tắc hỗn loạn.
- Mất điện → đại trận hộ tông tan vỡ.
- Xe hết xăng → linh lực tọa kỵ cạn kiệt.
- Mẹ gọi ăn cơm → tông chủ triệu kiến.

CẤU TRÚC ĐOẠN VĂN:
- Mở đầu bằng một câu thật hoành tráng, phong vân biến sắc.
- Miêu tả diễn biến sự việc bằng ngôn ngữ tu tiên kỳ ảo.
- Kết thúc bằng một câu đậm chất "đại đạo" hoặc "nhân quả" sâu sắc, nhưng thực chất chỉ phản ánh đúng kết quả của sự việc đời thường ban đầu.

VÍ DỤ MẪU:
Đầu vào: "Tôi đi pha mì nhưng phát hiện hết nước sôi nên phải chờ 10 phút."
Đầu ra: "Thiên địa vừa rạng sáng, bản tọa vốn định luyện chế một bát Linh Diện có thể bổ sung chân nguyên sau một đêm bế quan. Nào ngờ khi triệu hồi Huyền Đỉnh Thủy Hỏa, mới phát hiện linh tuyền chưa hề sôi, hỏa ý còn yếu, thiên hỏa chưa đủ để khai lò. Dù cưỡng ép luyện hóa lúc này, Linh Diện tất sẽ thất bại, đạo tâm cũng khó tránh khỏi lưu lại tâm ma. Bản tọa đành thu hồi thần thức, vận chuyển Huyền Thiên Dưỡng Tâm Quyết, tĩnh tọa mười khắc thời gian, chờ thiên hỏa đạt đến đỉnh phong. Mười phút trôi qua, hơi nước bốc lên như chân long xuất thế, linh khí cuồn cuộn bao phủ cả căn bếp. Chỉ trong vài hơi thở, bát Linh Diện cuối cùng cũng đại thành. Quả nhiên, người hiểu đạo đều biết, có những cơ duyên không thể cưỡng cầu; chỉ khi hỏa hầu viên mãn, đại đạo mới chịu mở đường."

Yêu cầu xuất bản: CHỈ TRẢ VỀ DUY NHẤT ĐOẠN TU TIÊN ĐÃ DỊCH XONG. Tuyệt đối không thêm bất kỳ nhận xét, phân tích, tiêu đề phụ hay ký tự nào ngoài văn bản dịch.

Đoạn nhật ký đời thường cần dịch:
"${text}"`;

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Lỗi kết nối tới Gemini API');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
}

// --- Main Refine Action ---
refineBtn.addEventListener('click', async () => {
    const text = mortalInput.value.trim();
    if (!text) {
        showToast('Hãy ghi chép nhật ký vào Phàm Nhân Bản trước!', 'error');
        return;
    }

    // Update UI states for processing
    refineBtn.disabled = true;
    magicCircle.classList.add('spinning');
    circleStatus.textContent = 'REFINING';
    outputPlaceholder.classList.add('hidden');
    immortalOutput.classList.add('hidden');
    
    copyBtn.disabled = true;
    shareBtn.disabled = true;

    try {
        let refinedText = '';
        if (geminiApiKey) {
            // Online Mode
            refinedText = await translateOnline(text, geminiApiKey);
        } else {
            // Offline Mode (Wait a bit to simulate processing)
            await new Promise(resolve => setTimeout(resolve, 1500));
            refinedText = translateOffline(text);
        }

        // Show Output with Typewriter Effect
        typewriter(immortalOutput, refinedText);
        
        showToast('Luyện hóa thành công thần thông!', 'success');
    } catch (error) {
        console.error(error);
        showToast(`Luyện hóa thất bại: ${error.message}. Tự động chuyển sang Ngoại Tuyến.`, 'error');
        
        // Fallback to offline
        const fallbackText = translateOffline(text);
        typewriter(immortalOutput, fallbackText);
    } finally {
        refineBtn.disabled = false;
        magicCircle.classList.remove('spinning');
        circleStatus.textContent = 'QI';
    }
});

// Typewriter Effect
function typewriter(element, text) {
    element.textContent = '';
    element.classList.remove('hidden');
    
    let index = 0;
    const speed = 25; // ms per character
    
    function write() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            // Scroll output to bottom if overflow
            const container = document.getElementById('immortalOutputContainer');
            container.scrollTop = container.scrollHeight;
            setTimeout(write, speed);
        } else {
            // Finished
            copyBtn.disabled = false;
            shareBtn.disabled = false;
        }
    }
    
    write();
}

// --- Copy & Share Functionality ---

// Copy to Clipboard
copyBtn.addEventListener('click', () => {
    const text = immortalOutput.textContent;
    if (!text) return;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('Đã thu thần thông vào túi càn khôn (Sao chép thành công)!', 'success');
        })
        .catch(err => {
            console.error('Lỗi sao chép:', err);
            showToast('Thần lực bất ổn, không thể sao chép!', 'error');
        });
});

// Share / Download Thần Ký
shareBtn.addEventListener('click', () => {
    const text = immortalOutput.textContent;
    if (!text) return;

    if (navigator.share) {
        // Use Web Share API if available (mainly mobile)
        navigator.share({
            title: 'Thần Ký Tu Tiên Luyện Hóa',
            text: text,
            url: window.location.href
        })
        .then(() => showToast('Đã truyền tống thần ký thành công!', 'success'))
        .catch(err => {
            console.log('Share canceled or failed:', err);
            downloadTextFile(text);
        });
    } else {
        // Fallback to text file download
        downloadTextFile(text);
    }
});

function downloadTextFile(text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `than_thong_ky_su_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Đã chế tác thành văn thư truyền tống (Tải xuống tệp .txt)!', 'success');
}
