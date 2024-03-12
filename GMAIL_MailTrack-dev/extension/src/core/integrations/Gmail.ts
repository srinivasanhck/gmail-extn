import util from "../util/Util";
import Tag from "../classes/Tag";
import Logo from "../classes/Logo";
import SideBar from "../classes/SideBar";
import AnalyticButton from "../classes/AnalyticButton";
import AnalyticPage from "../classes/AnalyticPage";
import CatchupButton from "../classes/CatchupButton";
import CatchupInnerButton from "../classes/CatchupInnerButton";
import CatchupPage from "../classes/CatchupPage";
import InnerLogo from "../classes/InnerLogo";

export default class GmailIntegration {
  // Bases
  name = "gmail";
  loaded_selector = "body";
  init() {
// Get the button element
window.addEventListener("load",()=>{

  const catchupButton: HTMLElement | null = document.querySelector(".catchup-button-root");
  
  if (catchupButton) {
    // Calculate the position of the button
    const buttonRect: DOMRect = catchupButton.getBoundingClientRect();
    const buttonTop: number = buttonRect.top;
    const buttonLeft: number = buttonRect.left;
    const buttonWidth: number = buttonRect.width;
    
    // Calculate the position of the toast relative to the button
    const toastTop: number = buttonTop + 60 -19; // Adjust this value as needed
    const toastLeft: number = buttonLeft + (buttonWidth / 2)-127.5+5; 


    //for popup/modal
    // add css active  to extension-popup
    document.documentElement.insertAdjacentHTML("beforeend", `<div class="extension-popup">
    <div class="extension-popup-inner"></div>
    </div>`)
    
    document.documentElement.insertAdjacentHTML("beforeend", `<div class="extension-toast" style="position:fixed; top:${toastTop}px; left:${toastLeft}px">
    <div class="extension-toast-inner">
    <img src=${chrome.runtime.getURL("../assets/boxTick.svg")} alt="boxTick" />
    </div>
    <div class="extension-toast-inner">Added to catchup later</div>
    <div class="extension-toast-cancel">
    <img src=${chrome.runtime.getURL("assets/cancel.svg")} alt="cancel" />
    </div>
    </div>`)
    const cancelButton=document.querySelector(".extension-toast-cancel");
    cancelButton.addEventListener("click",()=>{
      const toast=document.querySelector(".extension-toast");
      if(toast){
        toast.classList.remove("active");
      }
    })
  }
})

    let analytic_page: any = null;
    let catchup_page:any = null;

    // Routing service
    window.addEventListener("hashchange", async (event: HashChangeEvent) => {
      console.log("hashchanged");
      switch (window.location.hash) {
        case "#analytic":
          analytic_page = new AnalyticPage();
        // console.log("analytic page gmail");
          util.create_window_api(analytic_page);

          analytic_page.init();
          await analytic_page.inject();
          break;

          case "#catchup":{
            catchup_page=new CatchupPage();
            util.create_window_api(catchup_page);
            break;
          }
          
        default:
          if (analytic_page) {
            analytic_page.destroy();
          }
          else if(catchup_page) {
            catchup_page.destroy();
          }
      }
    });
  }

  async detect_dom(index: number) {
    // console.log(11,"has entered detect dom");
    const catchS=document.querySelector(".aeH");  /*'[gh="mtb"]'*/
    if(catchS){
      if(catchS && window.location.hash.includes("#label/catchup") && !catchS.getAttribute("data-extension-detected")){
        console.log("catchSS",catchS);
        
    
        const addedLogo = new InnerLogo(catchS,"beforeend");
        addedLogo.init();
        catchS.setAttribute("data-extension-detected", "true" );
      }
    }


    //add logo insde mail(catchuplater tab)
const addLogoInsideMail=document.querySelector("div[jsaction='NqvLIb:.CLIENT;swrS2e:.CLIENT'][gh='tm']");
if(addLogoInsideMail){
  if(addLogoInsideMail && window.location.hash.includes("#label/catchup") && !addLogoInsideMail.getAttribute("data-extension-detected")){
    console.log("got what is needed",addLogoInsideMail);
    

    const addedLogo = new InnerLogo(addLogoInsideMail,"beforeend");
    addedLogo.init();
    addLogoInsideMail.setAttribute("data-extension-detected", "true" );
    const buttonRect: DOMRect = addLogoInsideMail.getBoundingClientRect();
    const buttonTop: number = buttonRect.top;
    const buttonLeft: number = buttonRect.left;
    const buttonWidth: number = buttonRect.width;
    
    // Calculate the position of the toast relative to the button
    const toastTop: number = buttonTop + 50; // Adjust this value as needed
    const toastLeft: number = 3; 
console.log("buttonRect",buttonRect);
    document.documentElement.insertAdjacentHTML("beforeend", `<div class="extension-notespopup" style="position:fixed; top:${toastTop}px; right:${toastLeft}rem">
    <div class="extension-notespopup-inner">
        <div class="extension-notespopup-text">Are you considering adding a task?</div>
        <div class="extension-notespopup-cancel">
        <img src=${chrome.runtime.getURL("assets/cancelBlack.svg")} width="100%" alt="cancel" />
        </div>
    </div>
    <div class="extension-notespopup-addTask">
    <div class="extension-notespopup-button"><img src=${chrome.runtime.getURL("assets/notes.svg")} alt="Add note" width="23px" /> Add Task</div>
    </div>
    </div>`)
    const cancelButton=document.querySelector(".extension-notespopup-cancel");
    cancelButton.addEventListener("click",()=>{
      const toastNotes=document.querySelector(".extension-notespopup");
      if(toastNotes){
        toastNotes.classList.remove("active");
      }
    })

    //Event Listener for the button
    const addButton=document.querySelector(".extension-notespopup-button");
    addButton.addEventListener("click",()=>{
      const toastNotes = document.querySelector(".extension-notespopup"); 
      if(toastNotes){
        toastNotes.classList.remove("active");

        (async () => {
          // Inject sidebar
          const email_detail = document.querySelector("[role='main'][jsaction*='CLIENT']");
          console.log("email_detail", email_detail);
          if (email_detail && !email_detail.getAttribute("data-extension-detected")) {
              email_detail.setAttribute("data-extension-detected", "true");
              const sidebar = new SideBar({ root: email_detail, width: 320 });
              util.create_window_api(sidebar);
              sidebar.init();
              await sidebar.inject();
          }
      })();

      }
    })

    setTimeout(() => {
      const toastNotes = document.querySelector(".extension-notespopup");
      if (toastNotes) {
          toastNotes.classList.add("active");
      }
  }, 2000); 

  }
}



    
    // Logo
    const settings = document.querySelector("[data-ogsr-up]");
    if (settings && !settings.getAttribute("data-extension-detected")) {
      settings.setAttribute("data-extension-detected", "true");
      
      const logo: any = new Logo(settings, "afterbegin");
      
      logo.init();
    }
    
    // SideBar
    // const email_detail = document.querySelector("[role='main'][jsaction*='CLIENT']");
    // // console.log("email_detail", email_detail);
    // if (email_detail && !email_detail.getAttribute("data-extension-detected")) {
    //   email_detail.setAttribute("data-extension-detected", "true");
    //   const sidebar = new SideBar({root: email_detail,width: 320});
    //   util.create_window_api(sidebar);
 
    //   sidebar.init();
    //   await sidebar.inject();
    // }
    

    //Analytic button
    let navigator = document.querySelector("[role='navigation'] [aria-labelledby]");
    if (!navigator) navigator = document.querySelector("[role='navigation'] + div [aria-labelledby]");
    // console.log("navigator", navigator);
    if (navigator && !navigator.getAttribute("data-extension-detected")) {
      navigator.setAttribute("data-extension-detected", "true");
      const analytic_button = new AnalyticButton(navigator, "beforeend");
      // console.log("analytic btn")
      analytic_button.init();
    }


    //catchup button
    let catch_selectors = document.querySelector("[role='navigation'] [aria-labelledby]");
    if(!catch_selectors){
      catch_selectors=document.querySelector("[role='navigation'] + div [aria-labelledby]");
    }
    if (catch_selectors) {
        const bylDiv = catch_selectors.querySelector(".byl");
        if (bylDiv) {
            const tkDiv = bylDiv.querySelector(".TK");
            if (tkDiv) {
              const firstDivInsideTk = tkDiv.querySelector("div:first-child");
              if (firstDivInsideTk) {
                // console.log("First div insideTK", firstDivInsideTk);
                if(firstDivInsideTk && !firstDivInsideTk.getAttribute("data-extension-detected")) {
                  firstDivInsideTk.setAttribute("data-extension-detected", "true");
                  
                  const catch_up_button=new CatchupButton(firstDivInsideTk,"beforeend");
                  catch_up_button.init();
                }
              }
            }
          }
        }



        //catchup button alternative
  //   const catch_selector= document.querySelector("[role='navigation'] #\\:kz > div:first-child .TK > div:first-child");
  //   console.log("catchup", catch_selector);
  //   if(catch_selector && !catch_selector.getAttribute("data-extension-detected")) {
  //     catch_selector.setAttribute("data-extension-detected", "true");

  // const catch_up_button=new CatchupButton(catch_selector,"beforeend");
  // catch_up_button.init();
  //   }


  const catchup_inner_selector=document.querySelector("[role='main'][jsaction*='CLIENT'] [jsaction='JIbuQc:.CLIENT'] div:first-child");
  //catchup inner button
// console.log("catchup_inner:" , catchup_inner_selector);
if(catchup_inner_selector && !catchup_inner_selector.getAttribute("data-extension-detected")) {
  catchup_inner_selector.setAttribute("data-extension-detected", "true");
  // document.documentElement.insertAdjacentHTML("beforeend", `<div class="extension-toast" style="position:fixed; top:300px; left:400px">
  // <div class="extension-toast-inner">
  // <img src=${chrome.runtime.getURL("../assets/boxTick.svg")} alt="boxTick" />
  // </div>
  // <div class="extension-toast-inner">Added to catchup later</div>
  // <div class="extension-toast-cancel">
  // <img src=${chrome.runtime.getURL("assets/cancel.svg")} alt="cancel" />
  // </div>
  // </div>`)
  const catchup_inner_button=new CatchupInnerButton(catchup_inner_selector,"afterbegin");
  catchup_inner_button.init();
}
  }
}

