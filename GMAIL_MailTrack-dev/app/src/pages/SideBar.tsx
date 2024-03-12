import { useEffect, useState, useMemo } from "react";
import { window_send_message } from "@/store";
import Box from "@mui/material/Box";
// import CloseIcon from "@mui/icons-material/Close";
import OpenIcon from "@mui/icons-material/MenuOpen";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import closeSvg from "../assets/closeWhite.svg";
import addSymbol from "../assets/addSymbol.svg";
import reminder2 from "../assets/reminder2.svg";
import notesSvg from "../assets/notes.svg";
import editSvg from "../assets/edit.svg";
import deleteSvg from "../assets/delete.svg";
import dummyImage from "../assets/dummyImage.svg";
import "../css/sidebar.css";
import TaskForm from "./TaskForm";
import axios from "axios";
import Cookies from 'js-cookie';

type AccessToken = string | undefined;

function SideBar() {
  const [sidebar_is_opened, set_sidebar_is_opened] = useState(true);
  const [task, setTask] = useState(true);
  const [cookieValue,setCookieValue]=useState<AccessToken>("");

  const ButtonControl = useMemo(() => {
    return (
      <IconButton
        sx={{ position: "absolute", top: "0px", right: "0px" }}
        onClick={handle_click_control}
        size="small"
        aria-label="close"
      >
        {sidebar_is_opened ? <img src={closeSvg} style={{ marginTop: "9px" }} alt="" width={"100%"} height={"12px"} /> : <OpenIcon />}
      </IconButton>
    );
  }, [sidebar_is_opened]);


  function handle_click_control() {
    set_sidebar_is_opened(!sidebar_is_opened);

    if (sidebar_is_opened) {
      window_send_message("parent", "handle_sidebar_close");
    } else {
      window_send_message("parent", "handle_sidebar_open");
    }
  }
  const handleAdd = () => {
    setTask(!task);
  }

  const handleCancel = () => {
    setTask(!task);
  }


  useEffect(() => {
    console.log("useffect invoked");
    window_send_message("parent", "handle_sidebar_iframe_ready");    
   
  }, [task]);


  
  function callCookie(){
  if(!cookieValue){
    window.postMessage({ type: 'getTokenForApp'}, '*');
  }
  }

  const handleMessage = (event:any) => {
    console.log("handleMessage event", event);
    if (event.data.type === 'tokenReceivedIn') {
      // Token received, now we can get the cookie
      const accessToken = Cookies.get('accessToken_in_sidebar') ;
      console.log('cookies sidebar', accessToken);
      setCookieValue(accessToken);

    }
  };

  useEffect(()=>{
    callCookie();
    window.addEventListener('message', handleMessage);

    return () => {
      // Clean up event listener
      window.removeEventListener('message', handleMessage);
    };
  },[])




  let array = [{
    title: "Design system drive here and this was there ",
    task: "My task",
    due: "Mar 24,2024 8:00 am",
    reminder: "04/04/2024 10:00 am"
  },
  {
    title: "Design system drive here and this was there ",
    task: "My task",
    due: "Mar 24,2024 8:00 am",
    reminder: "04/04/2024 10:00 am"
  },
  {
    title: "hello world",
    task: "My task",
    due: "Mar 24,2024 8:00 am",
    reminder: "04/04/2024 10:00 am"
  }
  ]


  // /to store accessToken in ls

  

  return (
    <>

      <Box className="sidebar" sx={{ position: "relative" }} >
        {ButtonControl}
        {sidebar_is_opened ? (

          <>
            <header className="sidebar__header">
              <Stack alignItems={"center"} justifyContent={"space-between"} direction="row" bgcolor={"#003C6B"} color={"white"} height={"40px"} alignContent={"center"} >
                <h4>Add Task (0)</h4>
                {/* <img src={closeSvg} alt="close" /> */}
              </Stack>
            </header>

            {
              task ? <>
                <section>
                  <Box display={"flex"} justifyContent={"center"} mt={"1.3rem"} borderRadius={"5px"}>
                    <Box className="add_task_button" onClick={handleAdd} >
                      <img className="addImage" src={addSymbol} alt="add" />
                      <p style={{ marginRight: "10px" }}>Add a task</p>
                    </Box>
                  </Box>
                </section>

                {/* <main style={{ display: "flex", justifyContent: "center" }}>
                  <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} width={"66%"} fontWeight={"bold"} height={"400px"}  >
                    <img src={dummyImage} alt="Image" />
                    <p style={{ lineHeight: 1.3, fontSize: "14px", textAlign: "center" }}>It's a calm day on this page, no activity at the movement. </p>
                  </Box>
                </main> */}


                {/* form data that i have to show */}
                <main>
                  <Box className="mainOuterBox">
                    {
                      array?.map((ele) => {
                 return <Box className="divv inputBoxx">
                  <Box className="firstOuterBox">
                          <input type="checkbox" name="" id="checkboxInput" />
                          <Box className="taskOuterBox">
                            <p className="titleEle" title="Title">{ele.title}</p>
                            <Box className="statusBox">In progress</Box>
                          </Box>
                  </Box>
                  <Box className="secondOuterBox">
                        {ele.task}
                  </Box>
                  <Box className="thirdOuterBox">
                        {ele.due}
                  </Box>
                  <Box className="fourthOuterBox">
                        <Box className="reminder2">
                        <img src={reminder2} alt="reminder" />
                        {ele.reminder}
                        </Box>
                        <Box className="editBox">
                          <div className="notesImage" title="View notes">
                             <img src={notesSvg} alt="" />
                          </div>
                          <div className="editImage">
                            <img src={editSvg} alt="" title="edit notes" />
                          </div>
                          <div className="deleteImage" title="delete">
                            <img src={deleteSvg} alt="" />
                          </div>
                        </Box>
                  </Box>

                  </Box>
                      })
                    }
                  </Box>
                </main>
              </> :
                <TaskForm onCancel={handleCancel} cookieValue={cookieValue} />
            }
          </>
        ) : (
          ""
        )}
      </Box>

    </>
  );
}

export default SideBar;






// import { useEffect, useState, useMemo } from "react";
// import { window_send_message } from "@/store";
// import Box from "@mui/material/Box";
// import CloseIcon from "@mui/icons-material/Close";
// import OpenIcon from "@mui/icons-material/MenuOpen";
// import Stack from "@mui/material/Stack";
// import IconButton from "@mui/material/IconButton";
// import "../css/sidebar.css";

// function SideBar() {
//   const [sidebar_is_opened, set_sidebar_is_opened] = useState(true);
//   const [isEditing,setIsEditing]=useState(false);
//   const [inputValue,setInputValue]=useState("");
//   const [notes,setNotes]=useState<{text:String,timeStamp:String}[]>([]);

//   const handleButtonClick=()=>{
//     setIsEditing(!isEditing);
//   }

//   const handleInputValue=(e:any)=>{
//     setInputValue(e.target.value);
//   }

//     const handleCancel=()=>{
//       setIsEditing(!isEditing);
//       setInputValue("");
//     }

//   const handleSave=()=>{
//     const timeStamp= new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
//     const newNote={text:inputValue, timeStamp:timeStamp}
//     setNotes([...notes,newNote]);
//     // console.log("save",notes);
//     setIsEditing(!isEditing);
//     setInputValue("");
//   }

//   const ButtonControl = useMemo(() => {
//     return (
//       <IconButton
//         sx={{ position: "absolute", top: "0px", right: "0px" }}
//         onClick={handle_click_control}
//         size="small"
//         aria-label="close"
//       >
//         {sidebar_is_opened ? <CloseIcon /> : <OpenIcon />}
//       </IconButton>
//     );
//   }, [sidebar_is_opened]);

//   useEffect(() => {
//     // console.log("sidebar.tsx");
//     window_send_message("parent", "handle_sidebar_iframe_ready");
//   }, []);

//   function handle_click_control() {
//     set_sidebar_is_opened(!sidebar_is_opened);

//     if (sidebar_is_opened) {
//       // console.log("sidebar.tsx11")
//       window_send_message("parent", "handle_sidebar_close");
//     } else {
//       window_send_message("parent", "handle_sidebar_open");
//     }
//   }

//   return (
//     <Box className="sidebar" sx={{ position: "relative" }}>
//       {ButtonControl}
//       {sidebar_is_opened ? (
//         <Box className="sidebar__inner" sx={{ padding: "7px" }}>
//           <header className="sidebar__header">
//             <Stack
//               alignItems={"center"}
//               justifyContent={"space-between"}
//               direction="row"
//             >
//               <h2>Notes</h2>
//             </Stack>
//           </header>

//           <section>
//           <Box className="sidebar_section1">
//             <Box>
//               <h4>Assigned to</h4>
//               <h2>Random Name</h2>
//             </Box>
//             <Box>
//               <h4>status</h4>
//               <select name="" id="">
//                 <option value="">Open</option>
//               </select>
//             </Box>
//           </Box>
//           </section>


//         <section>
//       {isEditing ? (
//         <>
//         <textarea className="add_note_input editing" placeholder="Type your note..." value={inputValue} onChange={handleInputValue} />
//         <Box className="textarea_buttons_box">
//         <button className="cancel_button" onClick={handleCancel}>cancel</button>
//         <button className="save_button" onClick={handleSave}>save</button>
//         </Box>
//         </>
//       ) : (
//         <button className="add_note_input" onClick={handleButtonClick}>
//           Add a note...
//         </button>
//       )}
//         </section>

//           <main className="sidebar__main">
//         {
//           notes?.map((ele,index)=>(
//             <Box key={index} className="notes_div">
//               <p>{ele.text}</p>
//               <p>{ele.timeStamp}</p>
//             </Box>
//           ))
//         }
//           </main>
//         </Box>
//       ) : (
//         ""
//       )}
//     </Box>
//   );
// }

// export default SideBar;
