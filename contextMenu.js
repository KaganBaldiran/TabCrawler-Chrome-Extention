
  updateContextMenu();
  
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
   
    updateContextMenu();

    chrome.storage.local.get(['listItems'], function(result) {
      var urllist = result.listItems || [];
  
      urllist.forEach(function (item) {
        var subitemId = "subItem" + item;
  
        if (info.menuItemId === subitemId) {
          chrome.tabs.update({ url: item });
        }
      });
    });
  });

  chrome.runtime.onMessage.addListener(function(request , sender ,sendResponse){
     
     if(request.signal === "update")
     {
      updateContextMenu();
      sendResponse("Context Menu is updated!");
     }
  });

  function updateContextMenu() {

    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: "TabCrawlerItem1",
        title: "Tab Url Saver",
        contexts: ["all"]
      });
  
      chrome.storage.local.get(['listItems'], function(result) {
        var urllist = result.listItems || [];

        urllist.forEach(function (item) {

          if(item.indexOf('delete') === -1)
          {
          var subitemId = "subItem" + item;
      
          chrome.contextMenus.create({
            id: subitemId,
            title: item,
            parentId: "TabCrawlerItem1",
            contexts: ["all"]
          });
         }

        });
        
      });
    });
  }

  chrome.commands.onCommand.addListener((command) => {
    
    chrome.storage.local.get(['listItems'], function(result) {
      var urllist = result.listItems || [];

      urllist.forEach(function(item){
        

      })
      
      switch (command) {
        case 'Tab1':
        chrome.tabs.update({ url: urllist[0]});
        break;

        case 'Tab2':
        chrome.tabs.update({ url: urllist[1]});
        break;

        case 'Tab3':
        chrome.tabs.update({ url: urllist[2]});
        break;

        case 'Tab4':
        chrome.tabs.update({ url: urllist[3]});
        break;
      
        default:
          break;
      }
      
    });
  });


  