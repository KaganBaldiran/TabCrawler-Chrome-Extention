let button1 = document.getElementById('createbutton');
let button2 = document.getElementById('deletebutton');
let urllist = document.getElementById('urllist');
let deletelist = document.getElementById('deletelist');

let elementCount = 0;

var allow = true;

var keyselection = null;

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

button1.addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("Current Website:", tab.url);

    if (tab) {
      createListItem(tab.url , false);
      alert(urllist.lastChild.textContent);
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
    deleteURL(keyselection)
  } else {
    alert('NO EFFECT!');

  }
});

function createListItem(text , deleting) {
  var item = document.createElement('button');
  item.className = "childnode";
  item.textContent = text;

  var deletebutton = document.createElement('button');
  deletebutton.textContent = "delete"+text;

  if(text.indexOf('delete') === -1)
  {
    if(!deleting)
    {
      urllist.appendChild(deletebutton);
    }
  }

  deletebutton.addEventListener("click", () => {
    deleteURL(deletebutton.textContent.substring(6));
    deleteURL(deletebutton.textContent);
    alert('DELETING THE ITEM');
  });
 
  urllist.appendChild(item);

    item.addEventListener("click", () => {
      chrome.tabs.update({ url: item.textContent });
    });

  elementCount++;

  const listItems = Array.from(urllist.getElementsByTagName('button')).map(li => li.textContent);
  chrome.storage.local.set({ listItems: listItems });

  
  
}
