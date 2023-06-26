
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
        title: "Tab Crawler Extension",
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
  