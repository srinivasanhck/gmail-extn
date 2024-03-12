import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import "../css/taskform.css";
import reminderSvg from "../assets/reminder.svg";
import calendarSvg from "../assets/calendar.svg";
import tagsImage from "../assets/tags.svg";
import dropDown from "../assets/dropdown.svg";
import myTask from "../assets/myTask.svg";
import followUp from "../assets/followUp.svg";
import other from "../assets/other.svg";
import closeWhite from "../assets/closeWhite.svg";
import axios from "axios";
import Cookies from 'js-cookie';

type AccessToken = string | undefined;
interface TaskFormProps {
  onCancel: () => void; // Define the type of onCancel prop
  cookieValue: AccessToken; 
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel, cookieValue }) => {
  const handleCancel = () => {
    onCancel();
  };

  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showTaskTypeDropdown, setShowTaskTypeDropdown] = useState(false);
  //tags
  const [tagInputValue, setTagInputValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  //form
  const [title, setTitle] = useState(""); //title
  const [selectedTaskType, setSelectedTaskType] = useState(''); //task type
  const [selectedReminderDateTime, setSelectedReminderDateTime] = useState(''); //reminder
  const [selectedDueDate, setSelectedDueDate] = useState(''); //due date
  const [textAreaValue, setTextAreaValue] = useState(''); //text area value

  const handleReminderClick = () => {
    setShowReminderPicker(true);
    // setShowDueDatePicker(false);
  };

  const handleReminderDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReminderDateTime(e.target.value);
  };

  const handleDueDateClick = () => {
    setShowDueDatePicker(true);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDueDate(e.target.value);
  };



  const handleCancelDueDate = () => {
    setShowDueDatePicker(false);
    // setSelectedDueDate('');
  };

  //Dropdown
  const toggleTaskTypeDropdown = () => {
    setShowTaskTypeDropdown(!showTaskTypeDropdown);
  };

  const handleTaskTypeSelect = (taskType: string) => {
    setSelectedTaskType(taskType);
    setShowTaskTypeDropdown(false);
  };


  // tags
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputValue(e.target.value); // Update tag input value
  };

  const handleInputKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleTags(); // Call handleTags function when Enter key is pressed
    }
  };

  const handleTags = () => {
    if (tags.length < 2 && tagInputValue.trim() !== "") {
      setTags((prevTags) => [...prevTags, tagInputValue]);
      setTagInputValue("");

    } else {
      // Display toast message if trying to add more than two tags
      // You can implement your own toast component or use a library like react-toastify
      alert("Cannot add more than two tags");
    }
  };

  const handleTagCancel = (index: number) => {
    setTags((prevTags) => {
      const newTags = [...prevTags];
      newTags.splice(index, 1); // Remove the tag at the specified index
      return newTags;
    });
  };



  const handleFormSubmit = async () => {
    console.log("submitted form")

    const formattedTags = tags.map(tag => ({ name: tag }));
    const currentDate = new Date();

    const formData = {
      title: title,
      taskType: selectedTaskType,
      reminderDate: selectedReminderDateTime,
      dueDate: selectedDueDate,
      tags: formattedTags,
      notes: textAreaValue,
      createdDate: currentDate,
      currentState: "In Progress"
    }
    if (!selectedTaskType) {
      alert("selected task type is not filled")
    }

    console.log(formData);


    try {
      const response = await axios.post("https://stage.ekalign.com/api/v1/tasks",
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookieValue}`,
          },
        }
      );
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  }


  return (
    <>
      <Box className="OuterBox">
        <form className="form" onSubmit={handleFormSubmit}>
    <p>cookie:{cookieValue}</p>
          {/* title */}
          <input type="text" placeholder="Title" className="inputBox" value={title} onChange={(e) => { setTitle(e.target.value) }} required />

          {/* dropdown */}

          <div className="dropdown inputBox">
            <div className="dropdown-label" onClick={toggleTaskTypeDropdown}>
              {selectedTaskType ? selectedTaskType : 'Select Task Type'}
              <img src={dropDown} alt="" />
            </div>
            {showTaskTypeDropdown && (
              <div className="dropdown-content">
                <div className="option" onClick={() => handleTaskTypeSelect('My Task')}>
                  <img src={myTask} alt="" style={{ marginRight: "10px" }} /> My Task
                </div>
                <div className="option" onClick={() => handleTaskTypeSelect('Folow Up')}>
                  <img src={followUp} alt="" style={{ marginRight: "10px" }} /> Follow Up
                </div>
                <div className="option" onClick={() => handleTaskTypeSelect('other')}>
                  <img src={other} alt="" style={{ marginRight: "10px" }} /> Other
                </div>
              </div>
            )}
          </div>


          {/* set reminder */}

          {!showReminderPicker && (
            <div className="div inputBox" onClick={handleReminderClick}>
              <p>Set Reminder</p>
              <img src={reminderSvg} alt="reminder" />
            </div>
          )}

          {showReminderPicker && (
            <div className="datetimePickerContainer">
              <input type="datetime-local" className="inputBox" onChange={handleReminderDateTimeChange} />
            </div>
          )}

          {/* due date  */}

          {/* <div className="div inputBox" onClick={handleDueDateClick}>
            <p>Due Date</p>
            <img src={calendarSvg} alt="reminder" />
          </div>
          {showDueDatePicker && (
            <div className="datetimePickerContainer">
              <input type="date" className="inputBox" onChange={handleDueDateChange} />
              <button className="buttons cancel" onClick={handleCancelDueDate}>
                close
              </button>
            </div>
          )} */}

          {!showDueDatePicker && (
            <div className="div inputBox" onClick={handleDueDateClick}>
              <p>Due Date</p>
              <img src={calendarSvg} alt="reminder" />
            </div>
          )}

          {showDueDatePicker && (
            <div className="datetimePickerContainer">
              <input type="date" className="inputBox" onChange={handleDueDateChange} />
            </div>
          )}


          {/* Add tags */}

          <div className="div inputBox tagg">
            {tags?.map((tag, index) => (
              <div className="eachTag" key={index}>
                <p className="pTag">{tag}</p>
                <img className="eachTagImage" src={closeWhite} alt="" title="cancel" width={"33px"} onClick={() => { handleTagCancel(index) }} /> </div>
            ))}
            {
              tags.length < 2 && <input type="text" placeholder="Add tags" className="tagsInput" value={tagInputValue} onChange={handleInputChange} onKeyDown={handleInputKeyDown} style={{ backgroundImage: `url(${tagsImage})` }} />
            }

            {
              tags.length < 1 && <span style={{ fontSize: "12px", marginTop: "14px", color: "red", fontWeight: "bold" }}>max 2</span>
            }

          </div>




          {/* <div className="div inputBox" onClick={()=>setTagInput(true)}>
          {tagInput ? (
            <>
          <input
            type="text"
            className="inputOfTag"
            value={tagInputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Type tag name and press Enter"
            />
            </>
        ) : (
          <div className="tags">
            <img src={tagsImage} alt="tagImage" className="tagImage" />
            <p>Add Tags</p>
          </div>
        )}
            <p style={{fontSize:"12px",marginTop:"14px", color:"red",fontWeight:"bold"}}>max 2</p>
          </div> */}
          {/* Display entered tags below input box */}

          {/* <div className="div divv tagsDispalyDiv">
      {tags?.map((tag, index) => (
        <div className="eachTag" key={index}><p className="pTag">{tag}</p> <img className="eachTagImage" src={closeWhite} alt="" title="cancel" width={"33px"} onClick={()=>{handleTagCancel(index)}} /> </div>
        ))}
        </div> */}


          {/* text area */}

          <textarea className="inputBox textArea" placeholder="Notes" value={textAreaValue} onChange={(e) => { setTextAreaValue(e.target.value) }} required></textarea>

          <div className="saveDiv">
            <button className="buttons cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="buttons submit">Submit</button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default TaskForm