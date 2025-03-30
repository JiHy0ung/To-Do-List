
/*
유저가 값을 입력한다
+ 버튼을 클릭하면 할 일 추가
delete 버튼을 클릭하면 할일 삭제
check 버튼을 믈릭하면 할일이 끝나면서 밑줄이 간다
    1. check 버튼을 클릭하는 순간 isComplete값을 false에서 true로 바꿈
    2. true이면 done, 밑줄 추가
    3. false이면 working으로 간주
working, done 탭을 누르면 언더바가 이동한다
done탭은 끝난 아이템만 working탭은 진행중인 아이템만
All탭을 누르면 다시 전체 아이템으로 돌아온다
*/

/*
개인적으로 추가한 부분
    1. 인풋창 포커스되면 있던 내용을 지움. (<- 불편할 수 있으나 중복 등록을 방지.) <- 5단계에서 미션으로 나옴.
    2. 인풋창이 비워진 상태로 addButton을 클릭하면 placeholder의 문구를 수정하여
        사용자가 할 일을 입력하도록 유인. <- 5단계에서 미션으로 나옴.
    3. 
*/

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let taskList = [];
let tabs = document.querySelectorAll(".task-tabs div");
let mode = 'tab-all';
let filterList = [];

let underLine = document.getElementById("under-line");

addButton.addEventListener("click", addTask);
taskInput.addEventListener("focus", function(){
    taskInput.value = "";
})

for(let i = 1; i < tabs.length; i++){
    tabs[i].addEventListener("click", function(event){
        filter(event);
    });
    tabs[i].addEventListener("click", function(event){
        Indicator(event);
    });
}

function Indicator(event){
    underLine.style.left = event.currentTarget.offsetLeft + "px";
    underLine.style.width = event.currentTarget.offsetWidth + "px";
    underLine.style.top =
    event.currentTarget.offsetTop + event.currentTarget.offsetHeight - 42.5 + "px";
    
    underLine.style.display = "flex"; 
}

function enterKey(){

    if(window.event.keyCode == 13){
        addTask();
    }

}

function addTask(){

    let task = {
        id: randomIdGenerate(),
        taskContent: taskInput.value,
        isComplete: false
    };

    if(task.taskContent == ""){
        taskInput.placeholder = "할 일이 없으십니까?";
        return;
    }

    for(let i = 0; i < taskList.length; i++){
        if(taskList[i].taskContent == task.taskContent){
            taskInput.value = ""
            taskInput.placeholder = "이미 등록된 할 일 입니다. 다른 할 일을 등록해주세요.";
            return;
        }
    }

    taskList.push(task);
    render();

}

function render(){

    let list = [];

    // 1. 내가 선택한 탭에 따라 리스트를 달리 보여준다.

    if(mode === 'tab-all'){
        list = taskList;
    }else if(mode === 'tab-working' || mode === 'tab-done'){
        list = filterList;
    }

    let resultHTML = "";

    for(let i = 0; i < list.length; i++){

        if(list[i].isComplete == true){
            resultHTML += `<div class = "task">
                    <div class = "task-done">
                        ${list[i].taskContent}
                    </div>
                    <div class = "buttons">
                        <button onclick="toggleComplete('${list[i].id}')" class = "check-btn">
                            <i class="check-color1 fa-regular fa-square-check"></i>
                        </button>
                        <button onclick = "deleteTask('${list[i].id}')" class = "delete-btn">
                            <i class="delete-color fa-regular fa-square-minus"></i>
                        </button>
                    </div>
                </div>`;
        }else{
            resultHTML += `<div class = "task">
                    <div class = "task-working">
                        ${list[i].taskContent}
                    </div>
                    <div class = "buttons">
                        <button onclick = "toggleComplete('${list[i].id}')" class = "check-btn">
                            <i class="check-color2 fa-regular fa-square-check"></i>
                        </button>
                        <button onclick = "deleteTask('${list[i].id}')" class = "delete-btn">
                            <i class="delete-color fa-regular fa-square-minus"></i>
                        </button>
                    </div>
                </div>`;
        }

        console.log(list[i]);
        
    }    

    document.getElementById("task-board").innerHTML = resultHTML;

}

function toggleComplete(id){

    for(let i = 0; i < taskList.length; i++){
        if(taskList[i].id == id){
            // 내가 짠 코드
            // taskList[i].isComplete? taskList[i].isComplete = false : taskList[i].isComplete = true;
            // 강의에서 나온 코드 -> 훨씬 간단, 스위치 같은 상황 -> 다크모드같은거에 써도 될 듯(실제로도 많이 쓰인다고 함)
            taskList[i].isComplete = !taskList[i].isComplete
            break;
        }
    }

    render();
}

function deleteTask(id){

    for(let i = 0; i < taskList.length; i++){
        if(taskList[i].id == id){
            // 내가 짠 코드
            // taskList.pop(taskList[i]);
            // 강의에 나온 코드
            taskList.splice(i, 1);
            break;
        }
    }

    render();
    
}

function filter(event){

    mode = event.target.id;
    filterList = [];

    if(mode === "tab-all"){
        // 전체 리스트 보여줌.
        render();

    }else if(mode === "tab-working"){
        // isComplete = false 아이템 보여줌.
        for(let i = 0; i < taskList.length; i++){
            if(taskList[i].isComplete === false){
                filterList.push(taskList[i]);
            }
        }
        console.log("working", filterList)

        render();

        
    }else if(mode === "tab-done"){
        // isComplete = true 아이템 보여줌.
        for(let i = 0; i < taskList.length; i++){
            if(taskList[i].isComplete === true){
                filterList.push(taskList[i]);
            }
        }
        console.log("working", filterList)

        render();

    }

}

// 객체 아이디 랜덤화
/* 원래는 라이브러리를 가져다 이용해야하지만
우선은 간단하게 함수를 이용하여 아이디를 랜덤하게 설정
(-> 정보들엔 아이디가 필요하다)
*/
function randomIdGenerate(){
    return '-' + Math.random().toString(36).substring(2,9)
}