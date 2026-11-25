window.COURSE = [
{id:7,title:'Интерфейс и первый кликер',summary:'Соберём экран игры и научим кнопку добавлять монеты.',sections:[
{title:'Создай интерфейс',html:`<p>Создай сцену <b>Tycoon</b> и сохрани её. В Hierarchy нажми правой кнопкой → <b>UI → Canvas</b>. Unity также создаст EventSystem — она нужна для работы кнопок.</p><ol><li>Выбери Canvas. В Canvas Scaler установи <b>Scale With Screen Size</b>, Reference Resolution — <b>1920 × 1080</b>.</li><li>В Render Mode выбери <b>Screen Space - Camera</b> и перетащи Main Camera в поле Render Camera. Plane Distance установи в 10.</li><li>Внутри Canvas создай два элемента <b>UI → Text - TextMeshPro</b> и назови их MoneyText и PowerText. Если Unity предлагает импортировать TMP Essentials, нажми Import.</li><li>Создай <b>UI → Button - TextMeshPro</b>, назови ClickButton и измени текст вложенного объекта на «Получить монеты».</li></ol><p>В Hierarchy получится:</p><pre class="tree">Canvas\n├── MoneyText\n├── PowerText\n└── ClickButton\n    └── Text (TMP)\nEventSystem</pre><p>Расположи тексты и кнопку так, чтобы их было хорошо видно в окне Game.</p>`},
{title:'Добавь скрипт',html:`<p>В Hierarchy создай пустой объект <b>GameManager</b>. В папке Assets создай папку Scripts, а в ней скрипт <b>ClickerManager.cs</b>. Открой скрипт и замени его содержимое:</p>`,code:`using UnityEngine;
using TMPro;

public class ClickerManager : MonoBehaviour
{
    public int money = 0;
    public int clickPower = 1;
    public TextMeshProUGUI moneyText;
    public TextMeshProUGUI powerText;

    void Start()
    {
        UpdateUI();
    }

    public void AddMoney()
    {
        money = money + clickPower;
        UpdateUI();
    }

    void UpdateUI()
    {
        moneyText.text = "Монеты: " + money;
        powerText.text = "Сила клика: " + clickPower;
    }
}`,after:`<p><code>money</code> хранит монеты, а <code>clickPower</code> — доход за нажатие. Метод <code>AddMoney()</code> увеличивает счёт, а <code>UpdateUI()</code> обновляет надписи. <code>using TMPro</code> подключает работу с текстом TextMeshPro.</p>`},
{title:'Соедини объекты',html:`<ol><li>Перетащи скрипт ClickerManager на GameManager.</li><li>Выбери GameManager и перетащи MoneyText и PowerText из Hierarchy в одноимённые поля скрипта в Inspector.</li><li>Выбери ClickButton. В компоненте Button найди <b>On Click ()</b> и нажми <b>+</b>.</li><li>Перетащи GameManager в появившееся поле. В списке функций выбери <b>ClickerManager → AddMoney()</b>.</li></ol><div class="check"><b>Проверь себя</b><p>Нажми Play и несколько раз нажми кнопку. Монеты должны увеличиваться. Измени Click Power в Inspector во время игры: теперь один клик приносит больше монет.</p></div><p><b>Не работает?</b> Проверь поля Money Text и Power Text на GameManager и функцию в On Click. Если в Console есть ошибки, сначала исправь их.</p>`}]},
{id:8,title:'Магазин улучшений',summary:'Добавим покупку, которая усиливает клик и дорожает после каждой покупки.',sections:[
{title:'Подготовь кнопку магазина',html:`<p>Продолжай проект прошлого урока. В Canvas создай <b>Button - TextMeshPro</b>, назови UpgradeButton. Его дочерний текст назови UpgradeText. На этой кнопке будет показана цена.</p><pre class="tree">Canvas\n├── MoneyText\n├── PowerText\n├── ClickButton\n└── UpgradeButton\n    └── UpgradeText</pre>`},
{title:'Добавь покупку',html:`<p>Внутри класса <b>ClickerManager</b>, рядом с остальными переменными, добавь:</p>`,code:`public int upgradePrice = 10;
public TextMeshProUGUI upgradeText;`,after:`<p>Добавь в тот же класс новый метод:</p><pre><code>public void BuyUpgrade()
{
    if (money &gt;= upgradePrice)
    {
        money = money - upgradePrice;
        clickPower = clickPower + 1;
        upgradePrice = upgradePrice * 2;
        UpdateUI();
    }
    else
    {
        Debug.Log("Не хватает монет!");
    }
}</code></pre><p>Условие <code>money &gt;= upgradePrice</code> проверяет, хватает ли монет. При покупке монеты списываются, сила клика растёт на 1, а следующая цена удваивается.</p><p>В конец существующего метода <code>UpdateUI()</code> добавь строку:</p><pre><code>upgradeText.text = "Улучшить клик: " + upgradePrice;</code></pre>`},
{title:'Подключи и проверь',html:`<ol><li>На GameManager перетащи UpgradeText в поле Upgrade Text.</li><li>На UpgradeButton в On Click добавь GameManager и выбери <b>ClickerManager → BuyUpgrade()</b>.</li><li>Запусти игру. Попробуй купить улучшение без монет, а затем накопи 10 и купи его.</li></ol><div class="check"><b>Готово, если…</b><p>Монеты списались, сила клика стала равна 2, а следующая покупка стоит 20 монет. При нехватке монет покупка не проходит; сообщение видно во вкладке Console.</p></div>`}]},
{id:9,title:'Автодоход',summary:'Наймём помощника, который будет приносить монеты каждую секунду.',sections:[
{title:'Добавь интерфейс помощника',html:`<p>В Canvas создай кнопку <b>AutoButton</b>. Её дочерний текст назови <b>AutoText</b>. Продолжаем использовать ClickerManager из прошлых уроков.</p>`},
{title:'Создай таймер и покупку',html:`<p>Внутри класса ClickerManager добавь переменные и методы:</p>`,code:`public int autoIncome = 0;
public int autoPrice = 50;
public TextMeshProUGUI autoText;
private float timer = 0f;

void Update()
{
    timer = timer + Time.deltaTime;
    if (timer >= 1f)
    {
        timer = timer - 1f;
        money = money + autoIncome;
        UpdateUI();
    }
}

public void BuyAuto()
{
    if (money >= autoPrice)
    {
        money = money - autoPrice;
        autoIncome = autoIncome + 1;
        autoPrice = autoPrice * 2;
        UpdateUI();
    }
}`,after:`<p><code>Time.deltaTime</code> — время с прошлого кадра. Таймер накапливает его; когда проходит секунда, игра начисляет доход. Вычитание секунды сохраняет небольшой остаток времени.</p><p>Добавь в конец <code>UpdateUI()</code>:</p><pre><code>autoText.text = "Помощник (+" + autoIncome + "/сек): " + autoPrice;</code></pre>`},
{title:'Подключи кнопку',html:`<ol><li>Перетащи AutoText в поле Auto Text на GameManager.</li><li>В On Click кнопки AutoButton добавь GameManager и выбери <b>ClickerManager → BuyAuto()</b>.</li><li>Накопи 50 монет и купи помощника.</li></ol><div class="check"><b>Проверь себя</b><p>После покупки счёт растёт примерно на одну монету в секунду. Второй помощник стоит 100 монет и увеличивает доход до двух монет в секунду.</p></div>`}]},
{id:10,title:'Сохранение прогресса',summary:'Научим игру запоминать монеты и улучшения между запусками.',sections:[
{title:'Сохрани и загрузи значения',html:`<p><b>PlayerPrefs</b> хранит значения по именам-ключам. Добавь эти методы внутрь ClickerManager:</p>`,code:`public void SaveGame()
{
    PlayerPrefs.SetInt("Money", money);
    PlayerPrefs.SetInt("ClickPower", clickPower);
    PlayerPrefs.SetInt("UpgradePrice", upgradePrice);
    PlayerPrefs.SetInt("AutoIncome", autoIncome);
    PlayerPrefs.SetInt("AutoPrice", autoPrice);
    PlayerPrefs.Save();
    Debug.Log("Игра сохранена!");
}

void LoadGame()
{
    money = PlayerPrefs.GetInt("Money", 0);
    clickPower = PlayerPrefs.GetInt("ClickPower", 1);
    upgradePrice = PlayerPrefs.GetInt("UpgradePrice", 10);
    autoIncome = PlayerPrefs.GetInt("AutoIncome", 0);
    autoPrice = PlayerPrefs.GetInt("AutoPrice", 50);
}`,after:`<p>Например, <code>GetInt("Money", 0)</code> читает монеты по ключу Money. Если сохранения ещё нет, вернётся 0.</p><p>Замени существующий метод <code>Start()</code>, чтобы сначала загрузить значения, а затем обновить экран:</p><pre><code>void Start()
{
    LoadGame();
    UpdateUI();
}</code></pre>`},
{title:'Добавь сохранение и сброс',html:`<p>Добавь в ClickerManager:</p>`,code:`public void ResetGame()
{
    PlayerPrefs.DeleteKey("Money");
    PlayerPrefs.DeleteKey("ClickPower");
    PlayerPrefs.DeleteKey("UpgradePrice");
    PlayerPrefs.DeleteKey("AutoIncome");
    PlayerPrefs.DeleteKey("AutoPrice");
    money = 0;
    clickPower = 1;
    upgradePrice = 10;
    autoIncome = 0;
    autoPrice = 50;
    PlayerPrefs.Save();
    UpdateUI();
}

void OnApplicationQuit()
{
    SaveGame();
}`,after:`<p>Создай кнопки «Сохранить» и «Сбросить». В On Click каждой перетащи GameManager и выбери соответственно <b>SaveGame()</b> и <b>ResetGame()</b>. Сброс удаляет сохранения этого кликера.</p>`},
{title:'Проверь сохранение',html:`<div class="check"><b>Проверь себя</b><p>Запусти игру, заработай монеты, купи улучшение и нажми «Сохранить». Останови Play и запусти снова: показатели должны восстановиться. Затем нажми «Сбросить» и проверь начальные значения.</p></div><p>Кнопка сохранения помогает проверить работу в редакторе; <code>OnApplicationQuit()</code> также сохраняет при выходе из приложения.</p>`}]},
{id:11,title:'Эффекты: частицы и звук',summary:'Добавим визуальный и звуковой отклик на клик.',sections:[
{title:'Подготовь эффект',html:`<ol><li>Создай <b>GameObject → Effects → Particle System</b> и назови CoinEffect.</li><li>В Inspector отключи <b>Looping</b> и <b>Play On Awake</b>. В разделе Emission добавь Burst, чтобы частицы появлялись коротким всплеском.</li><li>Настрой цвет, размер и скорость. Нажми Play в окне Particle System и посмотри результат.</li></ol><p>Камера должна видеть эффект. Если он перекрыт Canvas, проверь положение системы и настройки Canvas из первого урока.</p>`},
{title:'Подключи эффект и звук',html:`<p>Выбери GameManager и добавь компонент <b>Audio Source</b>. Отключи Play On Awake. Импортируй короткий звуковой файл WAV или MP3 в Assets. Добавь переменные внутрь ClickerManager:</p>`,code:`public ParticleSystem coinEffect;
public AudioSource audioSource;
public AudioClip clickSound;`,after:`<p>В существующий метод <code>AddMoney()</code> после <code>UpdateUI();</code> добавь:</p><pre><code>if (coinEffect != null)
{
    coinEffect.Play();
}
if (audioSource != null &amp;&amp; clickSound != null)
{
    audioSource.PlayOneShot(clickSound);
}</code></pre><p>Проверка <code>!= null</code> убеждается, что объект назначен. <code>PlayOneShot</code> воспроизводит короткий звук.</p>`},
{title:'Проверь отклик',html:`<p>На GameManager перетащи CoinEffect в поле Coin Effect, компонент Audio Source — в Audio Source, а звуковой файл — в Click Sound.</p><div class="check"><b>Проверь себя</b><p>В Play нажми кнопку: монеты увеличиваются, появляется всплеск и слышен звук. Если звук слишком громкий, уменьши Volume у Audio Source.</p></div>`}]},
{id:12,title:'Достижения, баланс и релиз',summary:'Добавим цели для игрока и проверим, насколько интересно играть.',sections:[
{title:'Подготовь достижения',html:`<p>Создай в Canvas текст <b>AchievementText</b>. Перетащи его в поле Achieve Text на GameManager после добавления переменной ниже. Текст будет показывать последнее полученное достижение.</p><p>Внутрь ClickerManager добавь переменные и методы:</p>`,code:`public int totalClicks = 0;
public TextMeshProUGUI achieveText;
private bool ach100Clicks = false;
private bool ach1000Money = false;
private bool achFirstHelper = false;

void CheckAchievements()
{
    if (totalClicks >= 100 && !ach100Clicks)
    {
        ach100Clicks = true;
        ShowAchievement("100 кликов!");
    }
    if (money >= 1000 && !ach1000Money)
    {
        ach1000Money = true;
        ShowAchievement("1000 монет!");
    }
    if (autoIncome >= 1 && !achFirstHelper)
    {
        achFirstHelper = true;
        ShowAchievement("Первый помощник!");
    }
}

void ShowAchievement(string title)
{
    achieveText.text = "Достижение: " + title;
}`,after:`<p>Переменная типа <code>bool</code> хранит <code>true</code> или <code>false</code>. Флаг не даёт выдавать одно достижение много раз за один запуск.</p>`},
{title:'Включи проверку',html:`<p>В начале существующего метода <code>AddMoney()</code> добавь строку:</p><pre><code>totalClicks = totalClicks + 1;</code></pre><p>А в конец существующего <code>UpdateUI()</code> добавь:</p><pre><code>CheckAchievements();</code></pre><p>Поля кликов и флаги в этой версии не сохраняются после перезапуска — их можно добавить в систему сохранения как дополнительное задание.</p>`},
{title:'Проведи плейтест',html:`<ol><li>Начни игру с нуля и найми первого помощника. Убедись, что появилась надпись о достижении.</li><li>Попроси друга поиграть. Спроси, когда он купил первое улучшение и где стало скучно.</li><li>Измени начальные цены и доход в Inspector, снова проверь игру. Если уже есть сохранение, сначала сбрось его.</li></ol><div class="check"><b>Финальная проверка</b><p>Кнопки работают, покупки списывают монеты, доход начисляется, сохранение восстанавливает прогресс, а эффект и звук не мешают игре.</p></div>`}]}
];
