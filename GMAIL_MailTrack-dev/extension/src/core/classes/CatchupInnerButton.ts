import Component from "../bases/Component";

export default class CatchupInnerButton extends Component {
  component_class_selector = "catchup-innerbutton-root-div";

  mounted() {
    console.log("catchupbtnn mounted");
    this.component_el.addEventListener("click", async (event: MouseEvent) => {
      console.log("button clicked");

      async function getAccessToken() {
        // Retrieve token from storage
        const token = await new Promise<string>((resolve) => {
          chrome.storage.sync.get("accessToken", (data) => {
            console.log("Access token in getc", data.accessToken);
            resolve(data.accessToken);
          });
        });
        return token;
      }

        try {
            let messageId;
            //to get message id elemnt from gmail ui
            const targetElement = document.querySelector('div.adn.ads');
            if (targetElement) {
              console.log("Found the target element:", targetElement);
               messageId = targetElement.getAttribute('data-legacy-message-id');
              if(messageId){
                console.log("Legacy message id", messageId);
               const response = await fetch("https://stage.ekalign.com/api/v1/emails/catch-up-later-emails", {
              method: "POST",
              body: JSON.stringify({ standardEmailId: messageId }),
              headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${await getAccessToken()}`
              }
            })
            const data = await response.json();
            console.log("data at CIB", data);
            chrome.runtime.sendMessage({type:"applyLabel",messageId:messageId});
            chrome.runtime.sendMessage({action:"appliedLabel",eventName:"appliedLabel"})
              }
            } 
            else {
              console.log("Target element not found.");
            }
          }
          catch (error) {
            console.log("error at paramValue", error)
          }
        })
      }
  
    

  template() {
    return /*html*/ `
    <button class="catchup-innerbutton-root" title="Add to catchup">
      <span class="catchup-innerbutton-root__icon">
        <img src="${chrome.runtime.getURL("assets/catchup.svg")}" alt="catchup innerbutton">
      </span>
      <p>Catch up later</p>
      
    </button>

    <!-- Style -->
    <style>
    .catchup-innerbutton-root-div{
        height:32px !important;
        width:146px;
        display:flex;
        justify-content: center;
        align-items: center;
        background: #202124;
        border-radius:5px;
        margin-right:25px;
        transition: box-shadow 0.3s ease;
        box-shadow:0 12px 25px rgba(0,0,0,0.25);
      }

      .catchup-innerbutton-root:hover,
      .catchup-innerbutton-root-div:hover {
        background-color: #121314;
        box-shadow:0 20px 25px rgba(0,0,0,0.25);
        }
      
      p{
        margin-left:8px;
        font-size:14px;
        color:white;
      }
      .catchup-innerbutton-root {
        cursor: pointer;
        display: flex;
        align-items: center;
        width:135px;
        height:27px;
        border:none;
        transition-duration: 200ms;
        background-color:#202124;
      }
      img{
        margin-top:4px;
      }
      .catchup-innerbutton-root__icon {
      }
    </style>
  `;
  }
}