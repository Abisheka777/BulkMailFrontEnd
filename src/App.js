import axios from "axios";
import { useState } from "react";
//we need every data from XLSX library
import * as XLSX from "xlsx"

function App() {
//Creating usestate  for the message which we are  typing to send
  const [msg,setmsg] = useState("")
//To change Send Button to Sending,Intially it is set to false after email has send it will be changed to true
  const [status,setstatus] = useState(false)
//putting every emails in an array
  const [emailList,setEmailList] = useState([])
//Creating handle  for the message which we are  typing to send
  function handlemsg(evt)
  {
    setmsg(evt.target.value)
  }
//Choose-file from backend
  function handlefile(event)
  {
    const file = event.target.files[0]
  console.log(file)
//reading the data in the binary format
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target.result;
  //reading the data with huma understandable language with xlsx
    const workbook = XLSX.read(data, { type: 'binary' })
  //Extracting sheetname and worksheet ie .Extracting only the emails from the excel sheet created
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
  //Extracting emails precisely with the header which starts  with A 
    const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})

  //map function to get all the email one by one -Only the email
    const totalemail = emailList.map(function(item){return item.A})
    console.log(totalemail)
    setEmailList(totalemail)
    
  }

  reader.readAsBinaryString(file);
  }
  //Whenever send button is clicked this function is called
  function send()
  {
    setstatus(true)
  //axios will call the https link and will send the msg and emaillist to the frontend
    axios.post("http://localhost:5000/sendemail",{msg:msg,emailList:emailList})
  //The second data is error,info from the backend
    .then(function(data)
    {
      if(data.data === true)
      {
        alert("Email Sent Successfully")
        setstatus(false)
      }
      else{
        alert("Failed")
        setstatus(false)
      }
    })
  }
// Front End Design of the Bulkmail
  return (
    <div>
      <div className="bg-[#1a001a] text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>

      <div className="bg-[#330033] text-white text-center">
        <h1 className="font-medium px-5 py-3">You Can Send Thousands of email at Once !!!</h1>
      </div>

      <div className="bg-[#990099] text-white text-center">
        <h1 className="font-medium px-5 py-3">Enhanced Mailing Experience</h1>
      </div>

      <div className="bg-[#ff99ff] flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md bg-[#ffe6ee]" placeholder="Mail Text Here....."></textarea>

        <div>
          <input type="file" onChange={handlefile}  className="border-[#330033] border-2 rounded-md py-4 px-4 mt-5 mb-5" />
        </div>

        <p>Total Emails in the file: {emailList.length}</p>

        <button  onClick={send} className="mt-2 bg-[#1a001a] py-2 px-2 text-white font-medium rounded-md w-fit">{status?"Sending...":"Send"}</button>
 



      </div>

      <div className="bg-[#ffccff] text-white text-center p-8">

      </div>

      <div className="bg-[#ffe6ff] text-white text-center p-8">

      </div>

    </div>
  );
}

export default App;
