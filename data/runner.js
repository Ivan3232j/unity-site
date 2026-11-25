const movement1 = `using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public float speed = 10f;
    CharacterController controller;

    void Start()
    {
        controller = GetComponent<CharacterController>();
    }

    void Update()
    {
        Vector3 move = new Vector3(0, -1f, speed);
        controller.Move(move * Time.deltaTime);
    }
}`;
const movement2 = `using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public float speed = 10f;
    public float laneDistance = 3f;
    public float jumpForce = 8f;
    public float gravity = 20f;

    CharacterController controller;
    int lane = 1;
    float verticalSpeed;

    void Start()
    {
        controller = GetComponent<CharacterController>();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.A) && lane > 0)
            lane = lane - 1;
        if (Input.GetKeyDown(KeyCode.D) && lane < 2)
            lane = lane + 1;

        if (controller.isGrounded)
        {
            verticalSpeed = -1f;
            if (Input.GetKeyDown(KeyCode.Space))
                verticalSpeed = jumpForce;
        }
        else
        {
            verticalSpeed = verticalSpeed - gravity * Time.deltaTime;
        }

        float targetX = (lane - 1) * laneDistance;
        float moveX = (targetX - transform.position.x) * 10f;
        Vector3 move = new Vector3(moveX, verticalSpeed, speed);
        controller.Move(move * Time.deltaTime);
    }
}`;
const cameraCode = `using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    public Transform player;

    void LateUpdate()
    {
        transform.position = new Vector3(0, 4, player.position.z - 7);
    }
}`;
const destroyCode = `using UnityEngine;

public class DestroyBehind : MonoBehaviour
{
    public float length = 0f;
    public float distance = 10f;
    Transform player;

    void Start()
    {
        player = GameObject.FindWithTag("Player").transform;
    }

    void Update()
    {
        if (transform.position.z + length < player.position.z - distance)
            Destroy(gameObject);
    }
}`;
const chunkCode = `using UnityEngine;

public class ChunkSpawner : MonoBehaviour
{
    public GameObject[] chunks;
    public Transform player;
    public float chunkLength = 30f;
    float nextZ = 30f;

    void Update()
    {
        if (nextZ - player.position.z < 120f)
        {
            SpawnChunk();
        }
    }

    void SpawnChunk()
    {
        int index = Random.Range(0, chunks.Length);
        Instantiate(chunks[index], new Vector3(0, 0, nextZ), Quaternion.identity);
        nextZ = nextZ + chunkLength;
    }
}`;
const obstacleCode = `using UnityEngine;

public class ObstacleSpawner : MonoBehaviour
{
    public GameObject obstaclePrefab;
    public Transform player;
    public float spawnInterval = 1.5f;
    float timer;

    void Update()
    {
        timer = timer + Time.deltaTime;
        if (timer >= spawnInterval)
        {
            timer = 0f;
            int lane = Random.Range(0, 3);
            float x = (lane - 1) * 3f;
            Vector3 position = new Vector3(x, 1f, player.position.z + 40f);
            Instantiate(obstaclePrefab, position, Quaternion.identity);
        }
    }
}`;
const gameManager5 = `using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class RunnerGame : MonoBehaviour
{
    public GameObject gameOverPanel;
    public bool isGameOver = false;

    void Start()
    {
        gameOverPanel.SetActive(false);
    }

    public void GameOver()
    {
        if (isGameOver) return;
        isGameOver = true;
        gameOverPanel.SetActive(true);
    }

    public void RestartGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }
}`;
const gameManager6 = `using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

public class RunnerGame : MonoBehaviour
{
    public GameObject gameOverPanel;
    public TextMeshProUGUI scoreText;
    public TextMeshProUGUI bestText;
    public bool isGameOver = false;
    int score = 0;
    int best = 0;

    void Start()
    {
        gameOverPanel.SetActive(false);
        best = PlayerPrefs.GetInt("RunnerBest", 0);
        UpdateUI();
    }

    public void AddCoin()
    {
        if (isGameOver) return;
        score = score + 1;
        UpdateUI();
    }

    void UpdateUI()
    {
        scoreText.text = "Монеты: " + score;
        bestText.text = "Рекорд: " + best;
    }

    public void GameOver()
    {
        if (isGameOver) return;
        isGameOver = true;
        if (score > best)
        {
            best = score;
            PlayerPrefs.SetInt("RunnerBest", best);
            PlayerPrefs.Save();
        }
        UpdateUI();
        gameOverPanel.SetActive(true);
    }

    public void RestartGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }
}`;
window.RUNNER_LESSONS = [
{id:13,title:'Первый забег',summary:'Создадим дорогу, бегуна и камеру, которая следует за ним.',sections:[
{title:'Подготовь сцену',html:`<p>Создай новый 3D-проект в Unity 6 и сохрани сцену как <b>TempleRun</b>.</p><p>Открой <b>Edit → Project Settings → Player → Other Settings → Active Input Handling</b>, выбери <b>Both</b> и согласись на перезапуск редактора. Так будут работать клавиши в наших скриптах.</p><ol><li>Создай <b>3D Object → Cube</b>, назови StartRoad. Установи Position <b>(0, −0.5, 15)</b> и Scale <b>(9, 1, 30)</b>.</li><li>Создай <b>3D Object → Capsule</b>, назови Player. Position: <b>(0, 1, 2)</b>, Scale: <b>(1, 1, 1)</b>. В Inspector установи Tag: <b>Player</b>.</li><li>У Player удали компонент Capsule Collider и добавь <b>Character Controller</b>. Оставь настройки по умолчанию.</li></ol><pre class="tree">Hierarchy\n├── Main Camera\n├── Directional Light\n├── StartRoad\n└── Player</pre>`},
{title:'Научи героя бежать',html:`<p>В папке Assets создай папку Scripts и скрипт <b>PlayerMovement.cs</b>. Открой скрипт и замени его содержимое этим кодом. Затем сохрани файл и перетащи скрипт на Player:</p>`,code:movement1,after:`<p><code>GetComponent</code> находит Character Controller на том же объекте. <code>Move</code> двигает героя: по Z вперёд, а небольшое значение по Y удерживает его на дороге. <code>Time.deltaTime</code> делает скорость независимой от частоты кадров.</p>`},
{title:'Подключи камеру',html:`<p>В папке Scripts создай скрипт <b>CameraFollow.cs</b> и вставь код:</p>`,code:cameraCode,after:`<ol><li>Перетащи скрипт на Main Camera. Перетащи Player из Hierarchy в поле <b>Player</b> компонента Camera Follow.</li><li>Поверни Main Camera: Rotation <b>(15, 0, 0)</b>. Камера будет находиться позади и выше героя.</li><li>Нажми Play. Герой бежит вперёд, а камера следует за ним.</li></ol><div class="check"><b>Проверь себя</b><p>На старте герой стоит на дороге, камера видит его со спины, движение идёт вперёд. Пока дорога конечная — это исправим в третьем уроке.</p></div>`}]},
{id:14,title:'Три дорожки и прыжок',summary:'Добавим управление влево и вправо и прыжок через препятствия.',sections:[
{title:'Замени код движения',html:`<p>Открой <b>PlayerMovement.cs</b> и замени весь код версией ниже. Она уже содержит бег из прошлого урока, поэтому второй скрипт добавлять не нужно.</p>`,code:movement2,after:`<p><code>lane</code> хранит номер дорожки: 0 — левая, 1 — средняя, 2 — правая. Клавиши A и D меняют этот номер. Выражение <code>(lane - 1) * laneDistance</code> даёт позиции −3, 0 и 3.</p><p><code>isGrounded</code> проверяет, стоит ли герой на земле. Пробел задаёт скорость прыжка, а гравитация постепенно тянет его вниз.</p>`},
{title:'Проверь управление',html:`<ol><li>Выбери Player. Убедись, что компонент Player Movement включён и значения равны: Speed <b>10</b>, Lane Distance <b>3</b>, Jump Force <b>8</b>, Gravity <b>20</b>.</li><li>Запусти игру и щёлкни по окну Game. Нажми A, D и пробел.</li></ol><div class="check"><b>Проверь себя</b><p>Герой плавно меняет дорожки, не выходит за их края и прыгает только с земли.</p></div><p><b>Клавиши не работают?</b> Проверь Active Input Handling из урока 13 и после изменения дождись перезапуска Unity. При проверке сначала щёлкни по окну Game.</p>`}]},
{id:15,title:'Бесконечная дорога',summary:'Соберём участки пути и научим игру создавать их впереди героя.',sections:[
{title:'Сделай участок дороги',html:`<p>Каждый участок будет длиной 30 и начнётся в точке своего корневого объекта. Это важно: следующий участок должен начинаться точно там, где заканчивается предыдущий.</p><ol><li>Создай пустой объект <b>Chunk_1</b> с Position <b>(0, 0, 0)</b>. Внутри него создай Cube с именем Road.</li><li>У Road установи <b>локальные</b> Position <b>(0, −0.5, 15)</b> и Scale <b>(9, 1, 30)</b>. У Cube должен оставаться Box Collider.</li><li>Создай папку Assets/Prefabs и перетащи туда Chunk_1 из Hierarchy: получится prefab. Затем удали Chunk_1 из сцены; StartRoad оставь.</li><li>В Project сделай две копии prefab: Chunk_2 и Chunk_3. Можешь изменить их цвета, но сохрани одинаковые размеры и положение Road.</li></ol><pre class="tree">Chunk_1 (корень: 0, 0, 0)\n└── Road (локально: 0, −0.5, 15)</pre>`},
{title:'Удаляй пройденные участки',html:`<p>В папке Scripts создай скрипт <b>DestroyBehind.cs</b>. Скрипт удаляет объект, когда его конец оказался далеко позади игрока.</p>`,code:destroyCode,after:`<ol><li>Открой каждый из трёх prefab участков в Prefab Mode и добавь <b>DestroyBehind</b> на корень Chunk. Установи Length <b>30</b>, Distance <b>10</b>.</li><li>Проверь Tag объекта Player: он должен быть <b>Player</b>. Скрипт ищет его именно по этому тегу.</li></ol><p>Скрипт учитывает всю длину участка, поэтому дорога не исчезнет у героя из-под ног.</p>`},
{title:'Создавай участки впереди',html:`<p>В папке Scripts создай скрипт <b>ChunkSpawner.cs</b>:</p>`,code:chunkCode,after:`<ol><li>Создай пустой объект <b>ChunkSpawner</b> и добавь на него скрипт.</li><li>Перетащи Player в поле Player. У массива Chunks установи Size <b>3</b> и перетащи в его элементы три prefab из папки Prefabs. Chunk Length оставь <b>30</b>.</li><li>Нажми Play и наблюдай за сценой и Hierarchy: впереди появляются участки, а пройденные исчезают.</li></ol><div class="check"><b>Проверь себя</b><p>Дорога не имеет щелей, герой может долго бежать вперёд, а число объектов не растёт бесконечно. Если образовалась щель, проверь локальное положение Road и длину всех участков.</p></div>`}]},
{id:16,title:'Случайные препятствия',summary:'Научим игру создавать препятствия на разных дорожках.',sections:[
{title:'Подготовь препятствие',html:`<ol><li>Создай Cube и назови его <b>Obstacle</b>. Установи Scale <b>(2.5, 2, 1)</b>. Оставь Box Collider включённым, Is Trigger — выключенным.</li><li>Создай тег <b>Obstacle</b>: Inspector → Tag → Add Tag → +. Затем выбери объект и назначь ему Tag <b>Obstacle</b>.</li><li>Добавь скрипт <b>DestroyBehind</b>: Length <b>0</b>, Distance <b>10</b>. Перетащи Obstacle в Assets/Prefabs и удали объект из сцены.</li></ol>`},
{title:'Добавь генератор',html:`<p>В папке Scripts создай скрипт <b>ObstacleSpawner.cs</b>:</p>`,code:obstacleCode,after:`<p><code>Random.Range(0, 3)</code> выбирает 0, 1 или 2. Из номера получается позиция X: −3, 0 или 3. Препятствие появляется на 40 единиц впереди героя.</p><ol><li>Создай пустой объект <b>ObstacleSpawner</b> и перетащи на него скрипт ObstacleSpawner.</li><li>Перетащи prefab Obstacle из Project в поле <b>Obstacle Prefab</b>, а Player из Hierarchy — в поле <b>Player</b>. Установи Spawn Interval <b>1.5</b>.</li><li>Запусти игру: впереди должны появляться препятствия на разных дорожках.</li></ol><div class="check"><b>Проверь себя</b><p>Препятствия стоят на дороге и исчезают позади. Сейчас они останавливают героя, но экран проигрыша ещё не появляется — добавим его в следующем уроке.</p></div>`}]},
{id:17,title:'Столкновение и перезапуск',summary:'Остановим забег при столкновении и добавим кнопку новой попытки.',sections:[
{title:'Создай экран окончания игры',html:`<ol><li>Создай пустой объект <b>GameManager</b>. В Canvas создай панель <b>GameOverPanel</b>, а внутри неё текст «Игра окончена» и кнопку <b>RestartButton</b> с надписью «Заново». Если Canvas не было, Unity создаст также EventSystem.</li><li>Сохрани сцену. Открой <b>File → Build Profiles → Scene List</b> и добавь открытую сцену в список. В некоторых версиях пункт называется <b>File → Build Settings → Add Open Scenes</b>.</li></ol><pre class="tree">GameManager\nCanvas\n└── GameOverPanel\n    ├── Текст (TMP)\n    └── RestartButton\nEventSystem</pre><p>Создай скрипт <b>RunnerGame.cs</b>:</p>`,code:gameManager5,after:`<p>Добавь его на GameManager и перетащи GameOverPanel в поле <b>Game Over Panel</b>. В On Click кнопки RestartButton добавь GameManager и выбери <b>RunnerGame → RestartGame()</b>.</p>`},
{title:'Обработай столкновение',html:`<p>В <b>PlayerMovement.cs</b> добавь внутрь класса, рядом с переменными:</p><pre><code>public RunnerGame game;</code></pre><p>В начало метода <code>Update()</code>, перед проверкой клавиш, добавь строку:</p><pre><code>if (game.isGameOver) return;</code></pre><p>И добавь внутрь класса новый метод, после закрывающей скобки Update:</p><pre><code>void OnControllerColliderHit(ControllerColliderHit hit)
{
    if (hit.gameObject.CompareTag("Obstacle"))
        game.GameOver();
}</code></pre><p><code>OnControllerColliderHit</code> вызывается, когда Character Controller касается объекта. При столкновении с тегом Obstacle сообщаем GameManager о проигрыше.</p><p>Выбери Player и перетащи GameManager в новое поле <b>Game</b>. Чтобы препятствия перестали появляться после проигрыша, выключи компонент ObstacleSpawner из метода GameOver: добавь в RunnerGame поле <code>public ObstacleSpawner obstacleSpawner;</code>, а после <code>isGameOver = true;</code> строку <code>obstacleSpawner.enabled = false;</code>. Перетащи объект ObstacleSpawner в поле Obstacle Spawner на GameManager.</p>`},
{title:'Проверь новую попытку',html:`<div class="check"><b>Проверь себя</b><p>При столкновении игрок останавливается и появляется панель. Кнопка «Заново» перезагружает сцену и запускает новый забег.</p></div><p>Если ничего не происходит, проверь тег Obstacle, поле Game на Player и ссылки Game Over Panel и Obstacle Spawner на GameManager. Если кнопка не перезапускает сцену, проверь Scene List и On Click.</p>`}]},
{id:18,title:'Монеты, рекорд и проверка игры',summary:'Добавим сбор монет, сохраним лучший результат и проверим готовую игру.',sections:[
{title:'Подготовь счётчик и монету',html:`<ol><li>В Canvas создай два текста TextMeshPro: <b>ScoreText</b> и <b>BestText</b>. Размести их вне GameOverPanel, чтобы они были видны во время игры.</li><li>Создай 3D Object → Sphere и назови Coin. Установи Scale <b>(0.7, 0.7, 0.2)</b> и яркий материал. В Sphere Collider включи <b>Is Trigger</b>.</li><li>Создай и назначь тег <b>Coin</b>. Перетащи Coin в Assets/Prefabs, затем удали его из сцены.</li><li>Открой каждый prefab Chunk в Prefab Mode и перетащи внутрь несколько копий Coin. Позиции должны быть <b>локальными относительно корня Chunk</b>, например (0, 1, 8), (3, 1, 16), (−3, 1, 24). Сохрани изменения prefab.</li></ol><p>Корень Chunk расположен в начале участка; монеты с Z от 0 до 30 окажутся над дорогой. Prefab монеты можно использовать в каждом участке.</p>`},
{title:'Добавь счёт и рекорд',html:`<p>Полностью замени <b>RunnerGame.cs</b> кодом ниже. Он включает экран проигрыша и перезапуск из прошлого урока, а также подсчёт монет.</p>`,code:gameManager6.replace('public bool isGameOver = false;', 'public ObstacleSpawner obstacleSpawner;\n    public bool isGameOver = false;').replace('isGameOver = true;\n        if (score > best)', 'isGameOver = true;\n        obstacleSpawner.enabled = false;\n        if (score > best)'),after:`<p>В Inspector GameManager проверь все ссылки: Game Over Panel, Obstacle Spawner, Score Text и Best Text. <code>PlayerPrefs</code> хранит лучший счёт под ключом RunnerBest; при новом запуске текущий счёт начинается с нуля.</p>`},
{title:'Собирай монеты',html:`<p>В <b>PlayerMovement.cs</b> добавь внутрь класса новый метод:</p><pre><code>void OnTriggerEnter(Collider other)
{
    if (!game.isGameOver &amp;&amp; other.CompareTag("Coin"))
    {
        game.AddCoin();
        Destroy(other.gameObject);
    }
}</code></pre><p>При входе в триггер монеты счёт увеличивается, а монета исчезает. Проверка <code>!game.isGameOver</code> запрещает сбор после проигрыша.</p><div class="check"><b>Финальная проверка</b><p>Собери несколько монет, столкнись с препятствием и нажми «Заново». Счёт начнётся с нуля, а рекорд останется. Закрой и снова открой игру: рекорд должен сохраниться.</p></div><p>Поиграй несколько раз: можно ли увернуться от препятствий? Настрой скорость и интервал появления так, чтобы игра была интересной, но оставляла время на реакцию.</p>`}]}
];
