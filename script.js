// Create an array to store window elements
var windows = [];
var taskbar = [];
let index = 1;

// Function to initialize a window and its event listeners
function initWindow(windowElement) {
    var isMouseDown = false;
    var offsetX, offsetY, windowAmount;

    var titleBar = windowElement.querySelector('.titleBar');
    var closeButton = windowElement.querySelector('.close'); // Get the close button element

    var leftResize = windowElement.querySelector('.left')
    var rightResize = windowElement.querySelector('.right')
    var topResize = windowElement.querySelector('.top')
    var bottomResize = windowElement.querySelector('.bottom')

    var initialWidth = windowElement.offsetWidth
    var initialHeight = windowElement.offsetHeight
    
    var initialLeft, initialRight, initialTop, initialBottom
    var leftDown, rightDown, topDown, bottomDown;

    windowElement.addEventListener('mousedown', function (e) {
        index += 1;
        windowElement.style.zIndex = index
    })

    titleBar.addEventListener('mousedown', function (e) {
        isMouseDown = true;
        offsetX = e.clientX - windowElement.getBoundingClientRect().left;
        offsetY = e.clientY - windowElement.getBoundingClientRect().top;
    });

    closeButton.addEventListener('click', function () {
        // Remove the window element from the DOM
        windowElement.remove();

        // Remove the window element from the windows array
        var indexToRemove = windows.indexOf(windowElement);
        if (indexToRemove !== -1) {
            windows.splice(indexToRemove, 1);
        }
    });

    document.addEventListener('mouseup', function () {
        isMouseDown = false;
        leftDown = false
        rightDown = false
        topDown = false
        bottomDown = false
    });

    document.addEventListener('mousemove', function (e) {
        if (isMouseDown) {
            // Check if the mouse is within the viewport
            if (
                e.clientX >= 0 && e.clientX <= window.innerWidth &&
                e.clientY >= 0 && e.clientY <= window.innerHeight
            ) {
                windowElement.style.left = (e.clientX - offsetX) + 'px';
                windowElement.style.top = (e.clientY - offsetY) + 'px';
            }
        }

        if (leftDown) {
            const newWidth = initialWidth + (offsetX - e.clientX); // Calculate the new width
            const newLeft = initialLeft - (offsetX - e.clientX); // Calculate the new left position

            if (newWidth >= 200) {
                windowElement.style.width = newWidth + 'px';
                windowElement.style.left = newLeft + 'px';
            }
        }

        if (rightDown) {
            const newWidth = initialWidth + (e.clientX - offsetX); // Calculate the new width
            if (newWidth >= 200) {
                windowElement.style.width = newWidth + 'px';
            }
        }

        if (topDown) {
            const newHeight = initialHeight - (e.clientY - offsetY);
            const newTop = initialTop + (e.clientY - offsetY)
            if (newHeight >= 200) {
                windowElement.style.height = newHeight + 'px'
                windowElement.style.top = newTop + 'px'
            }
        }

        if (bottomDown) {
            const newHeight = initialHeight + (e.clientY - offsetY);
            if (newHeight >= 200) {
                windowElement.style.height = newHeight + 'px'
            }
        }
    });

    leftResize.addEventListener('mousedown', function (e) {
        leftDown = true;
        offsetX = e.clientX;
        initialWidth = windowElement.offsetWidth; // Store the initial width
        initialLeft = windowElement.getBoundingClientRect().left; // Store the initial left position
    });

    rightResize.addEventListener('mousedown', function (e) {
        rightDown = true;
        offsetX = e.clientX;
        initialWidth = windowElement.offsetWidth; // Store the initial width
        initialRight = windowElement.getBoundingClientRect().right; // Store the initial left position
    });

    topResize.addEventListener('mousedown', function(e) {
        topDown = true;
        offsetY = e.clientY
        initialHeight = windowElement.offsetHeight
        initialTop = windowElement.getBoundingClientRect().top
    })

    bottomResize.addEventListener('mousedown', function(e) {
        bottomDown = true
        offsetY = e.clientY
        initialHeight = windowElement.offsetHeight
        initialBottom = windowElement.getBoundingClientRect().bottom
    })
}

// Initialize windows
windows.push(document.getElementById('window1'));
windowAmount = windows.length;

// Initialize event listeners for each window
windows.forEach(function (windowElement) {
    initWindow(windowElement);
});

taskbar.push(document.getElementById('test'))
taskbar.push(document.getElementById('test2'))

taskbar.forEach(function (windowElement) {
    buttonPress(windowElement);
});

function buttonPress(windowElement) {
    windowElement.addEventListener('click', function() {
        var windoww = windowElement.getAttribute('windowName')

        var windowMain = document.createElement('div')
        windowMain.classList = "window"
        //  windowMain.id = "window" + windowAmount
        // windowAmount =+ 1

        var windowTitle = document.createElement('div')
        windowTitle.classList = "titleBar"

        var windowContent = document.createElement('div')
        windowContent.classList = "windowContent"

        var windowName = document.createElement('span')
        windowName.innerText = windowElement.getAttribute('windowName')

        var windowX = document.createElement('div')
        windowX.classList = "close"

        var windowXName = document.createElement('span')
        windowXName.innerText = "X"

        var leftResize = document.createElement('div')
        leftResize.classList = "left"

        var rightResize = document.createElement('div')
        rightResize.classList = "right"

        var topResize = document.createElement('div')
        topResize.classList = "top"

        var bottomResize = document.createElement('div')
        bottomResize.classList = "bottom"

        document.body.appendChild(windowMain)
        windowMain.appendChild(windowTitle)
        windowMain.appendChild(windowContent)
        windowTitle.appendChild(windowName)
        windowTitle.appendChild(windowX)
        windowX.appendChild(windowXName)

        windowMain.appendChild(leftResize)
        windowMain.appendChild(rightResize)
        windowMain.appendChild(topResize)
        windowMain.appendChild(bottomResize)

        if (windowElement.getAttribute('type') === "file") {
            // Use fetch to load the file content
            fetch(windowElement.getAttribute('fileSrc'))
                .then(response => response.text())
                .then(content => {
                    const windowContentText = document.createElement('p')
                    windowContentText.innerText = content

                    windowContent.appendChild(windowContentText)
                })
                .catch(error => {
                    console.error('Error loading file:', error);
                });
        } else if (windowElement.getAttribute('type') === 'fileSystem') {

            fetch('./files.json')
            .then((response) => response.json())
            .then((json) => {
                var fileSystem = document.createElement('div')
                fileSystem.classList = 'fileSystem'
                createFiles(json, windowContent, fileSystem)
            });


        }

        windows.push(windowMain)
        initWindow(windowMain)
    })
}

function createFiles(data, append, fileSystem) {
    var folders = [];
    for (const x in data) {
        if (data[x].type === 'folder') {
            folders.push(data[x])
        }
    }

    for (var f = 0; f < folders.length; f++) {
        var whole = document.createElement('div')
        whole.classList = 'folderWhole'

        var ico = document.createElement('img')
        ico.src = "./icos/folder.png"

        var text = document.createElement('span')
        text.innerText = folders[f].name

        append.appendChild(fileSystem)
        fileSystem.appendChild(whole)
        whole.appendChild(ico)
        whole.appendChild(text)
        folderClick(whole, data, text)
    }
}

function folderClick(folderElement, data, text) {
    folderElement.addEventListener('click', function (e) {
        var folderClicked;
        for (const x in data) {
            if (text.innerText === data[x].name) {
                folderClicked = data[x]
                console.log(text.innerText)
            }
        }
    })
}
