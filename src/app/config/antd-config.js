// Suppress Ant Design compatibility warning
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('antd: compatible')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
} 