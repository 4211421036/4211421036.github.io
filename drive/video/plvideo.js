const template = document.createElement('template');
template.innerHTML = `
<style>
        .home-section {
            position: relative;
            background: #E4E9F7;
            min-height: 100vh;
            top: 0;
            left: 78px;
            width: calc(100% - 78px);
            transition: all 0.5s ease;
            z-index: 2;
        }
        
        .sidebar.open~.home-section {
            left: 250px;
            width: calc(100% - 250px);
        }
        
        .home-section .text {
            display: inline-block;
            color: #11101d;
            font-size: 25px;
            font-weight: 500;
            margin: 18px
        }
        
        @media (max-width: 420px) {
            .sidebar li .tooltip {
                display: none;
            }
        }
</style>
<section class="home-section">
    <div class="text">
        <h3></h3>
    </div>
    <div class="row mt-4" id="posts"></div>
    <script src="https://g4lihriu.web.app/defualt.js"></script>
</section>
`;

class plvideo extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');    
    }
}

window.customElements.define('pljr-video', plvideo);