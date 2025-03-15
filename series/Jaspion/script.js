* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #1a1a1a;
    color: #ffffff;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
}

.main-content {
    margin: 60px 0 40px 0;
    flex: 1;
    position: relative;
    height: calc(100vh - 100px);
    overflow: hidden;
}

.footer {
    background-color: #1a1a1a;
    padding: 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.navbar {
    background-color: #1a1a1a;
    padding: 1rem 2rem;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    height: 60px;
    text-transform: uppercase;
}

.main-content {
    margin: 0;
    padding: 0;
    flex: 1;
    position: relative;
    height: calc(100vh - 100px);
    overflow: hidden;
}

.container {
    height: calc(100vh - 100px);
    width: 100%;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 600px;
    gap: 0;
    position: fixed;
    top: 60px;
}

.video-container {
    width: 100%;
    height: calc(100vh - 100px);
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.video-js {
    width: 100% !important;
    height: 100% !important;
    max-height: calc(100vh - 100px);
}

.video-navigation {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    display: flex;
    gap: 5px;
}

.nav-button {
    background-color: rgba(43, 51, 63, 0.7);
    color: white;
    border: none;
    border-radius: 3px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1.2em;
}

.nav-button:hover {
    background-color: rgba(115, 133, 159, 0.5);
}

.playlist-container {
    height: calc(100vh - 100px);
    background-color: #2a2a2a;
    border-radius: 0;
    padding: 0;
    overflow-y: auto;
    scroll-behavior: smooth;
}

.module {
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.module:hover {
    transform: translateY(-2px);
}

.module-title {
    color: #fff;
    font-size: 1em;
    padding: 12px 15px;
    background-color: #3a3a3a;
    margin-bottom: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.module-title:after {
    content: '+';
    font-size: 1.2em;
    transition: transform 0.3s ease;
}

.module.active .module-title:after {
    transform: rotate(45deg);
}

.module-title:hover {
    background-color: #444;
}

.video-list {
    display: none;
    transition: all 0.3s ease-in-out;
}

.module.active .video-list {
    display: block;
}

.video-item {
    padding: 12px 15px;
    margin: 0;
    background-color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
    display: flex;
    align-items: center;
}

.video-item:hover {
    background-color: #444;
    padding-left: 20px;
}

.video-item.active {
    background-color: #4a4a4a;
    border-left: 3px solid #8e44ad;
    padding-left: 20px;
}

.video-title {
    color: #ddd;
    font-size: 0.9em;
}

.footer {
    background-color: #1a1a1a;
    padding: 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    color: #888;
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }

    .video-container {
        margin-bottom: 20px;
    }

    .playlist-container {
        max-height: 400px;
    }

    .main-content {
        margin-top: 60px;
    }
}

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #2a2a2a;
}

::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
