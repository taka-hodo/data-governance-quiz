// 問題データ（ここに全50問分のデータを持つ）
const quizData = [
    {
        question_number: 1,
        question_en: "Every enterprise is subject to many governmental and industry regulations, many of which regulate how data and information is used and managed. Part of the Data Governance Function is to:",
        question_jp: "各企業は多くの政府および業界規制の対象となります。これらの規制の多くは、データの使用方法と管理方法を規定しています。データガバナンス機能の一部として正しいものは次のうちどれですか？",
        options_en: {
            A: "Implement data integration services",
            B: "Perform preliminary data screening and review",
            C: "Monitor and ensure regulatory compliance", // Correct
            D: "Define high-quality data",
            E: "Manage document and email retention periods"
        },
        options_jp: {
            A: "データ統合サービスを実装する",
            B: "予備的なデータスクリーニングとレビューを実行する",
            C: "規制遵守を監視し、保証する", // 正解
            D: "高品質データを定義する",
            E: "文書および電子メールの保持期間を管理する"
        },
        correct_answer: "C",
        explanation_jp: "DMBOKにおいて、データガバナンスはデータ管理活動全体に対する方針策定、監督、実施体制の構築を担います。規制遵守は、データガバナンスが果たすべき重要な役割の一つであり、特に外部規制や内部ポリシーへの適合性を監視し、保証することが主要な機能として挙げられます。選択肢A, B, D, Eはデータ統合、データ品質管理、コンテンツ管理などの個別のデータ管理機能の一部であり、これらはガバナンスフレームワークの下で実行されますが、ガバナンス機能そのものではありません。",
        explanation_en: "According to DMBOK, Data Governance is responsible for establishing policies, oversight, and implementation structures for overall data management activities. Regulatory compliance is a key role of data governance, specifically monitoring and ensuring conformity to external regulations and internal policies. Options A, B, D, and E are parts of specific data management functions like Data Integration, Data Quality Management, and Content Management, which are executed under the governance framework, but they are not the core function of Governance itself."
    },
    {
        question_number: 2,
        question_en: "Data governance guides the implementation of adequate controls to monitor and document compliance with data-related regulations. Which of the following is often the initial reason for implementing data governance?",
        question_jp: "データガバナンスは、データ関連規制への遵守を監視および文書化するための適切なコントロールの実装をガイドします。データガバナンスを実装する最初の理由として最も多いのは次のうちどれですか？",
        options_en: {
            A: "Improving data quality",
            B: "Implementing Master Data Management",
            C: "Achieving regulatory compliance", // Correct
            D: "Developing a business glossary",
            E: "Enabling data sharing"
        },
        options_jp: {
            A: "データ品質の向上",
            B: "マスターデータ管理の実装",
            C: "規制遵守の達成", // 正解
            D: "ビジネス用語集の開発",
            E: "データ共有の有効化"
        },
        correct_answer: "C",
        explanation_jp: "DMBOKで定義されるデータガバナンスの推進要因は複数ありますが、組織がデータガバナンスに本格的に取り組むきっかけとして最も一般的なのは、GDPRやCCPA、特定の業界規制などのデータ関連規制への対応要求です。規制への違反リスクや罰則を回避するために、データ管理体制を強化する必要性が生じ、その基盤としてデータガバナンスが導入されるケースが多く見られます。データ品質向上やMDMなどはガバナンスによってもたらされる効果や、ガバナンスの下で進められる活動ですが、初期の導入理由としては規制対応が強力なドライバーとなることが多いです。",
        explanation_en: "While DMBOK acknowledges various drivers for data governance, the most common catalyst for organizations to formally implement data governance programs is often the requirement to comply with data-related regulations such as GDPR, CCPA, or specific industry regulations. The need to mitigate risks of non-compliance and penalties drives the necessity to strengthen data management practices, leading to the implementation of data governance as the foundational framework. While data quality improvement, MDM, etc., are benefits or activities under governance, regulatory compliance is frequently the strong initial driver."
    },
    // TODO: Add 48 more questions here
    { /* Question 3 */ },
    // ...
    { /* Question 50 */ }
];

let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 50; // 問題の総数

const questionArea = document.getElementById('question-area');
const scoringArea = document.getElementById('scoring-area');
const questionNumberDiv = document.getElementById('question-number');
const questionTextEn = document.querySelector('#question-text .english-text');
const questionTextJp = document.querySelector('#question-text .japanese-text');
const optionsForm = document.getElementById('options-form');
const feedbackDiv = document.getElementById('feedback');
const showExplanationButton = document.getElementById('show-explanation-button');
const explanationDiv = document.getElementById('explanation');
const explanationTextJp = document.querySelector('#explanation .explanation-text-jp');
// const explanationTextEn = document.querySelector('#explanation .explanation-text-en'); // 英語版解説を使う場合
const nextQuestionButton = document.getElementById('next-question-button');
const finalScoreDiv = document.getElementById('final-score');
const passFailStatusDiv = document.getElementById('pass-fail-status');

// 問題をロードする関数
function loadQuestion(index) {
    if (index < totalQuestions) {
        const q = quizData[index];
        questionNumberDiv.textContent = `問題 ${q.question_number} / ${totalQuestions}`;
        questionTextEn.textContent = q.question_en;
        questionTextJp.textContent = q.question_jp;

        // 選択肢を生成
        optionsForm.innerHTML = ''; // 既存の選択肢をクリア
        for (const key in q.options_en) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.value = key;

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${key}. ${q.options_en[key]} / ${q.options_jp[key]}`));
            optionsForm.appendChild(label);
            optionsForm.appendChild(document.createElement('br'));

            // 選択時のイベントリスナーを追加 (即時判定)
            input.addEventListener('change', handleAnswer);
        }

        // 表示状態をリセット
        feedbackDiv.style.display = 'none';
        explanationDiv.style.display = 'none';
        showExplanationButton.style.display = 'none';
        nextQuestionButton.style.display = 'none';
        // ラジオボタンを再度有効にする（新しい問題なので）
        optionsForm.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = false);

    } else {
        // 全ての問題が終了した場合
        showScoring();
    }
}

// 解答を処理する関数
function handleAnswer(event) {
    const selectedAnswer = event.target.value;
    const correctAnswer = quizData[currentQuestionIndex].correct_answer;

    // ラジオボタンを無効にする
    optionsForm.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = true);

    // 正誤判定
    if (selectedAnswer === correctAnswer) {
        feedbackDiv.textContent = "正解！ (Correct!)";
        feedbackDiv.style.color = "green";
        score++; // 正解ならスコアを加算
    } else {
        feedbackDiv.textContent = `不正解... (Incorrect...) 正解は: ${correctAnswer}`;
        feedbackDiv.style.color = "red";
    }
    feedbackDiv.style.display = 'block';

    // 解説ボタンと次の問題ボタンを表示
    showExplanationButton.style.display = 'block';
    nextQuestionButton.style.display = 'block';

    // 解説ボタンのイベントリスナーを（複数登録されないように一度クリアしてから）登録
    showExplanationButton.onclick = null; // 既存イベントをクリア
    showExplanationButton.onclick = showExplanation;

    // 次の問題ボタンのイベントリスナーを登録
    nextQuestionButton.onclick = null; // 既存イベントをクリア
    if (currentQuestionIndex < totalQuestions - 1) {
        nextQuestionButton.textContent = "次の問題へ";
        nextQuestionButton.onclick = goToNextQuestion;
    } else {
        nextQuestionButton.textContent = "採点する";
        nextQuestionButton.onclick = showScoring;
    }
}

// 解説を表示する関数
function showExplanation() {
    const q = quizData[currentQuestionIndex];
    explanationTextJp.textContent = q.explanation_jp;
    // explanationTextEn.textContent = q.explanation_en; // 英語版解説を使う場合
    explanationDiv.style.display = 'block';
}

// 次の問題へ進む関数
function goToNextQuestion() {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
}

// 採点結果を表示する関数
function showScoring() {
    questionArea.style.display = 'none';
    scoringArea.style.display = 'block';

    const percentage = (score / totalQuestions) * 100;
    finalScoreDiv.textContent = `あなたの点数: ${score} / ${totalQuestions} (${percentage.toFixed(1)}%)`;

    let status = "";
    if (percentage < 60) {
        status = "不合格 (Fail)";
        passFailStatusDiv.style.color = "red";
    } else if (percentage >= 60 && percentage < 70) {
        status = "Associate 合格 (Associate Pass)";
        passFailStatusDiv.style.color = "orange";
    } else { // percentage >= 70
        status = "Practitioner 合格 (Practitioner Pass)";
        passFailStatusDiv.style.color = "green";
    }
    passFailStatusDiv.textContent = `結果: ${status}`;
}

// ページ読み込み時に最初の問題をロード
window.onload = () => {
    if (quizData.length !== totalQuestions) {
        console.error("問題データの数が設定された総数と一致しません！");
        // 必要に応じてエラーメッセージを表示
        return;
    }
    loadQuestion(currentQuestionIndex);
};