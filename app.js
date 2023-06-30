let button1 = document.getElementById('createbutton');
let button2 = document.getElementById('deletebutton');
let urllist = document.getElementById('urllist');
let deletelist = document.getElementById('deletelist');

let elementCount = 0;
var arrayID = 1;
var allow = true;
var keyselection = null;
var Keys = [255];
var SelectedButton = null;


document.addEventListener('mouseup', () => {
  keyselection = window.getSelection().toString();
});

chrome.storage.local.get(['listItems'], function(result) {
  if (result.listItems) {
    result.listItems.forEach(function(item) {
      createListItem(item , true);
    });
  }
});

document.addEventListener('keyup', function(event) 
{
       Keys[event.keyCode] = false;
 });

button1.addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("Current Website:", tab.url);

    if (tab) {
      createListItem(tab.url , false);
      alert(urllist.lastChild.textContent);

      UpdateServiceWorker();

    } else {
      console.log('Error fetching the current tab');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});

function deleteURL(textkey) {
  const listItems = Array.from(urllist.getElementsByTagName('button')).map(li => li.textContent);
  const updatedListItems = listItems.filter(item => item !== textkey);
  chrome.storage.local.set({ listItems: updatedListItems }, function() {
    console.log('Item removed from Chrome Storage');
  });

  urllist.innerHTML = '';
  deletelist.innerHTML = '';
  updatedListItems.forEach(function(item) {
    createListItem(item , true);
  });
}

button2.addEventListener("click", () => {
  
  if(SelectedButton !== null)
  {
    deleteURL(SelectedButton.textContent);
    UpdateServiceWorker();
  }
  else {
    alert('NO EFFECT!');
  }

});

function createListItem(text , deleting) {

  var item = document.createElement('button');
  item.className = "TabButton";
  item.textContent = text;
  item.draggable = true;
  var ID = null;
  
  urllist.appendChild(item);
  
  if(text.indexOf('delete') === -1)
  {
    ID = arrayID;
    console.log(arrayID);
    
    item.addEventListener("click", () => {
      chrome.tabs.update({ url: item.textContent });
    });

    document.addEventListener('keydown' , function(event)
    {
      Keys[event.keyCode] = true;

      const isTKeyPressed = Keys[84];
      const is1KeyPressed = Keys[49 + ID];

      console.log("are they pressed: " + is1KeyPressed + isTKeyPressed)
      
      if (isTKeyPressed && is1KeyPressed) {
        chrome.tabs.update({ url: item.textContent });
      }

    }); 

    item.addEventListener('dragstart' , OnDragStart);
    item.addEventListener('dragenter' , OnDragEnter);
    item.addEventListener('dragover' , OnDragOver);
    item.addEventListener('drop' , OnDrop);
    item.addEventListener('dropleave' , OnDragLeave);
    item.addEventListener('dragend' , OnDragEnd);

    arrayID++;

  }
  
  const listItems = Array.from(urllist.getElementsByTagName('button')).map(li => li.textContent);
  chrome.storage.local.set({ listItems: listItems });
}

function UpdateServiceWorker()
{
  chrome.runtime.sendMessage({signal:"update"} , function(response)
  {
     console.log("Response from service worker :: " + response);
  });

}

let dragStartButton = null;
let dragOverButton = null;

function OnDragStart(event)
{
    dragStartButton = event.target;
    event.dataTransfer.effectAllowed = 'move';
}

function OnDragEnter(event)
{
   dragOverButton = event.target;
   dragStartButton.style.setProperty('background-color', 'yellow');

}

function OnDragOver(event)
{
  event.preventDefault(event);
  dragOverButton.style.setProperty('background-color', 'gray');

}

function OnDragLeave(event)
{
  

}

function OnDrop(event)
{
  event.preventDefault();
  if(dragOverButton && dragStartButton)
  {
    swapButtons(dragStartButton , dragOverButton);

  }
}

function OnDragEnd(event)
{
  dragStartButton.style.setProperty('background-color', 'white');
  dragOverButton  = null;
  dragStartButton = null;

  urllist.forEach(function(item){

    if(item.textContent.indexOf('delete') === -1)
    {
      item.style.setProperty('background-color', 'white');
    }

  });

}


function swapButtons(button1 , button2)
{
  const parent = button1.parentNode;
  const index1 = Array.from(parent.children).indexOf(button1);
  const index2 = Array.from(parent.children).indexOf(button2);

  if(index1 < index2)
  {
    parent.insertBefore(button2,button1);
  }
  else{
    parent.insertBefore(button1 , button2);
  }

  UpdateList();

  UpdateServiceWorker();
}

function UpdateList()
{
  const listItems = Array.from(urllist.getElementsByTagName('button')).map(li => li.textContent);
  chrome.storage.local.set({ listItems: listItems });

  urllist.innerHTML = '';
  deletelist.innerHTML = '';
  listItems.forEach(function(item) {
    createListItem(item , true);
  });
}


document.addEventListener('contextmenu', function(event) {
  
  const clickedButton = event.target;

  if(clickedButton.className === 'TabButton')
  {
    event.preventDefault(); 

    var buttons = document.getElementsByClassName('SelectedButton');

    for (let index = 0; index < buttons.length; index++) {
      var element = buttons[index];
      element.className = 'TabButton';
    }

    SelectedButton = clickedButton;
    SelectedButton.className = 'SelectedButton';
  }
  else
  {

    if(SelectedButton !== null)
    {
      event.preventDefault();
    }

    var buttons = document.getElementsByClassName('SelectedButton');

    for (let index = 0; index < buttons.length; index++) {
      var element = buttons[index];
      element.className = 'TabButton';
    }

    SelectedButton = null;
  }

  console.log(clickedButton); 
});



