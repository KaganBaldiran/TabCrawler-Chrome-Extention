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
  if (keyselection) {
    deleteURL(keyselection);
    UpdateServiceWorker();
  } else {
    alert('NO EFFECT!');

  }
});

function createListItem(text , deleting) {

  var item = document.createElement('button');
  item.className = "TabButton";
  item.textContent = text;
  var ID = null;
  

  var deletebutton = document.createElement('button');
  deletebutton.textContent = "delete"+text;
  deletebutton.className = "DeleteTabButton";

  urllist.appendChild(item);
  

  if(text.indexOf('delete') === -1)
  {
    if(!deleting)
    {
      urllist.appendChild(deletebutton);
      
      elementCount++;

      deletebutton.addEventListener("click", () => {
        deleteURL(deletebutton.textContent.substring(6));
        deleteURL(deletebutton.textContent);
        UpdateServiceWorker();
        alert('DELETING THE ITEM');
      });

    }

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


    item.addEventListener('contextmenu', function(event) {
      event.preventDefault(); 
      SelectedButton = item;
    });

    arrayID++;

  }
  else
  {
    item.className = "DeleteTabButton";

    item.addEventListener("click", () => {
      deleteURL(item.textContent.substring(6));
      deleteURL(item.textContent);
      UpdateServiceWorker();
      alert('DELETING THE ITEM');
    });
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

document.addEventListener('mousedown', function(event) {

  if (event.button === 2) {
    if(SelectedButton !== null)
    {
      chrome.storage.local.get(['listItems'], function(result) {
        if (result.listItems) {
          result.listItems.forEach(function(item) {

            if(item.className === 'SelectedButton')
            {
              item.className = 'TabButton';
            }

          });
        }
      });

      SelectedButton.className = 'SelectedButton';

      
      event.preventDefault(); 
      
    }
  }
    
});


