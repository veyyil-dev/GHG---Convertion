import { Button } from "antd";



export default function ButtonComponent({text,onClick,type,icon,loading,disabled}){
    return(
        <Button type={type} onClick={onClick} icon={icon} loading={loading} disabled={disabled}>
            {text}
        </Button>
    )
}


