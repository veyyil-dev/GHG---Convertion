"use client"
import { Button, Card, Row, Col, Typography, Spin } from "antd"
import React, { useState,useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { DatabaseOutlined, LineChartOutlined } from '@ant-design/icons'
import { useScopeOne } from "../(Scopes)/ScopeOne/Context/ScopeOneContext"
import { useRouter } from "next/navigation"

const { Title, Text } = Typography;

export default function SelectDataEntryOrDataView() {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState('');
    const {getToken} = useScopeOne();
    const router = useRouter();

    const handleNavigation = (type) => {
        setIsLoading(true);
        setLoadingType(type);
    };

      useEffect(() => {
        const token = getToken();
        if (!token) {
          router.push('/login');
        }
      }, [router]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Spin size="large" />
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            style={{ marginTop: '20px' }}
                        >
                            <Text style={{ fontSize: '18px', color: '#1890ff' }}>
                                {loadingType === 'entry' ? 'Loading Data Entry...' : 'Loading Data View...'}
                            </Text>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative background elements */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: 0
                }}
                animate={{
                    rotate: 360
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Title level={2} style={{ 
                    marginBottom: '40px', 
                    color: '#1a1a1a',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                    letterSpacing: '1px'
                }}>
                    GHG Conversion Factors
                </Title>
            </motion.div>
            
            <Row gutter={[24, 24]} style={{ width: '100%', maxWidth: '800px', position: 'relative', zIndex: 1 }}>
                <Col xs={24} sm={12}>
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div onClick={() => handleNavigation('entry')}>
                            <Link href="/TemplateSelector" style={{ textDecoration: 'none' }}>
                                <Card
                                    hoverable
                                    style={{
                                        height: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                            background: 'rgba(255, 255, 255, 1)'
                                        }
                                    }}
                                >
                                    <DatabaseOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                                    <Title level={3} style={{ 
                                        marginBottom: '16px', 
                                        color: '#1890ff',
                                        fontWeight: '600',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Data Entry
                                    </Title>
                                    <Text style={{ 
                                        textAlign: 'center', 
                                        color: '#666',
                                        fontSize: '14px',
                                        lineHeight: '1.6'
                                    }}>
                                        Enter and manage your GHG conversion factors data
                                    </Text>
                                </Card>
                            </Link>
                        </div>
                    </motion.div>
                </Col>

                <Col xs={24} sm={12}>
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div onClick={() => handleNavigation('view')}>
                            <Link href="/ViewandEditData" style={{ textDecoration: 'none' }}>
                                <Card
                                    hoverable
                                    style={{
                                        height: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                            background: 'rgba(255, 255, 255, 1)'
                                        }
                                    }}
                                >
                                    <LineChartOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                                    <Title level={3} style={{ 
                                        marginBottom: '16px', 
                                        color: '#1890ff',
                                        fontWeight: '600',
                                        letterSpacing: '0.5px'
                                    }}>
                                        View Data / Edit Data
                                    </Title>
                                    <Text style={{ 
                                        textAlign: 'center', 
                                        color: '#666',
                                        fontSize: '14px',
                                        lineHeight: '1.6'
                                    }}>
                                        View and analyze your existing GHG conversion factors
                                    </Text>
                                </Card>
                            </Link>
                        </div>
                    </motion.div>
                </Col>
            </Row>
        </motion.div>
    )
}