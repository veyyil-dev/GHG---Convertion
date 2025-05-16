"use client"
import { createContext, useContext, useState ,useEffect} from "react"


const ScopeOneContext = createContext();

export function ScopeOneProvider({ children }) {




    const [checkedValuesScopeOne, setCheckedValuesScopeOne] = useState([]);
    const [selectedValuesScopeOne, setSelectedValuesScopeOne] = useState({});
    const [selectedFuels, setSelectedFuels] = useState({});
    const [activities, setActivities] = useState([]);
    const [fetchedParameters, setFetchedParameters] = useState({});
    const [userId, setUserId] = useState("");
    const [user_Id, setUser_Id] = useState("");
    const [templatecontent, settemplatecontent] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    // 🔹 Add shift state
    const [data, setData] = useState([]); // data entry page
    const [editTemplate, setEditTemplate] = useState("Create");
    const [allEntries, setAllEntries] = useState([]);
    const [fetchedCheckedValues, setFetchedCheckedValues] = useState([]);
    const [scopeOneTotal, setScopeOneTotal] = useState(null);
    // const [templatecontent, setTemplatecontent] = useState([]);
    const [getTemplate, setGetTemplate] = useState([]);

    console.log("getTemplate",getTemplate)

    const [username,setUsername] = useState("")

     const [pageChange, setPageChange] = useState(0);



    useEffect(() => {
        templateSelection()
            
        const username = localStorage.getItem("username");
        if(username){
            setUsername(username);
        }

    }, [])
    const templateSelection =async () => {

        const userId = localStorage.getItem("email")

        const response = await fetch(`https://ghg-conversion-factors-backend.vercel.app/getTemplates/${userId}`)
        const data = await response.json()
        console.log(data.template_names)
        setGetTemplate(data.template_names)

    }

    const getToken = () => {
        const token = localStorage.getItem('token');
        const expiry = localStorage.getItem('tokenExpiry');
      
        if (!token || !expiry) return null;
      
        if (new Date().getTime() > parseInt(expiry)) {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          localStorage.clear();
          return null;
        }
      
        return token;
      };

 




    return (

        <ScopeOneContext.Provider

            value={{
                userId, setUserId, allEntries, setAllEntries,data, setData,user_Id, setUser_Id,
                scopeOneTotal, setScopeOneTotal,
                templatecontent, settemplatecontent,
                selectedShift, setSelectedShift,
                checkedValuesScopeOne,
                pageChange, setPageChange,
                setCheckedValuesScopeOne,
                selectedValuesScopeOne,
                setSelectedValuesScopeOne,
                selectedFuels,
                getTemplate,
                setSelectedFuels,
                activities,
                setActivities,
                fetchedParameters,
                setFetchedParameters,
                editTemplate, setEditTemplate, fetchedCheckedValues, setFetchedCheckedValues,getToken,
                username


            }}>
            {children}



        </ScopeOneContext.Provider>



    )


}

export function useScopeOne() {


    return useContext(ScopeOneContext)


}