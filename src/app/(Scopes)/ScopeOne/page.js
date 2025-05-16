"use client";

import { useState, useEffect } from "react";
import HeaderForScopes from "../../../Componants/HeaderForScopes"
// import ScopeOneFactors from "./Activities/ScopeOneFactors";
import { Row, Col } from "antd"; // ✅ Correct
import ScopeTwoSelection from "../Scopetwo/ScopeTwoSelectionPage";
import FooterForScopes from "../../../Componants/FooterForScopes"
import ScopeThreeSelection from "../Scopethree/ScopeThreeSelection";
import ScopeOneSelection from "./ScopeOneSelectionPage";
import CreateTempName from "./Activities/CreareTempName";
import { useScopeOne } from "./Context/ScopeOneContext";
import { useRouter } from 'next/navigation';


export default function ScopeOneSelectionpage() {
  
 
   const router = useRouter()

  const {getToken,pageChange, setPageChange} = useScopeOne();

  const [changeShope, setChangeShope] = useState(0)

   useEffect(() => {
        const token = getToken();
        if (!token) {
          router.push('/login');
        }
      }, [router]);
 

  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: "100vh", textAlign: "center" }}>
  <Col span={24}>
    <HeaderForScopes changeShope={changeShope} setChangeShope={setChangeShope} />
  </Col>

  <Col span={24}>
    {changeShope === 0 && <CreateTempName pageChange={pageChange} />}
    {changeShope === 1 && <ScopeOneSelection pageChange={pageChange} />}
    {changeShope === 2 && <ScopeTwoSelection pageChange={pageChange} />}
    {changeShope === 3 && <ScopeThreeSelection pageChange={pageChange} />}
  </Col>
    
  <Col span={25}>
    <FooterForScopes pageChange={pageChange} setPageChange={setPageChange} changeShope={changeShope} setChangeShope={setChangeShope} />
  </Col>
</Row>
    </>
  );
}
