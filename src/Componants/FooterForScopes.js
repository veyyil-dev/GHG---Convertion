import { ArrowLeftOutlined, ArrowRightOutlined ,SaveOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { message } from "antd";
import "../app/globals.css";

export default function FooterForScopes({ pageChange, setPageChange, changeShope, setChangeShope }) {
  const router = useRouter();
  console.log("pageChange",pageChange)
  const [messageApi, messageContextHolder] = message.useMessage();
  console.log("changeShope",changeShope)  



  const handleSubmit = async () => {
    const userId = localStorage.getItem("email");
    const username = localStorage.getItem("username")
    const templateData = JSON.parse(localStorage.getItem("templateDataCreation"));
    const templatecontent = templateData.templateContent;
    const selectedFuels = templateData.selectedFuelsScope1;
    const selectedFuelsScope2 = templateData.selectedFuelsScope2;
    const goodsProduced = templateData.total_goods;
    const selectedUnit = templateData.templateUnit;
    if (!templatecontent.trim()) {
      messageApi.warning("Please enter a template name.");
      return;
    }

    try {
      const response = await fetch("https://ghg-conversion-factors-backend.vercel.app/saveScope1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          scope: "Scope 1", 
          username: userId,
          user_name:username, 
          templatecontent, 
          templatesave: selectedFuels, 
          templatesave_scope2: selectedFuelsScope2,
          total_goods:goodsProduced,
          goods_units: selectedUnit,
          
        }),
      });

      const data = await response.json();

      if (data.message == false) {  // Check if response is an error
        messageApi.error(data.error); // Show error message
      } else {
        console.log("Scope 1 saved successfully:", data);
        messageApi.success("Scope saved");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving Scope 1:", error);
      messageApi.error("Failed to save. Please try again.");
    }
  };

  // Function to handle navigation between scopes
  const handleScopeChange = (newScope) => {
    setChangeShope(newScope);
    setPageChange(0); // Reset page to 0 when changing scopes
  };

  return (
    <>
      {messageContextHolder}
      <div
        className="w-full px-4 mt-12 mb-8 flex justify-center"
        style={{
        position: "relative",
        bottom: 0,
      }}
    >
      <div
        className="flex justify-center sm:justify-start flex-wrap gap-3 sm:gap-4"
        style={{
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* Template Details (Scope 0) */}
        {changeShope === 0 && (
          <Button
            onClick={() => handleScopeChange(1)}
            className="bg-[#27A376] text-white border border-green-500 
                      px-4 sm:px-6 py-2 sm:py-3 rounded-lg 
                      text-sm sm:text-lg font-semibold flex items-center 
                      hover:bg-green-600 focus:ring-0 footer-for-scopes"
          >
            Go to Scope 1 <ArrowRightOutlined className="ml-2" />
          </Button>
        )}

        {/* Scope 1 Navigation */}
        {changeShope === 1 && (
          <>
            {/* Back to Template Details */}
            {pageChange === 0 && (
              <Button 
                onClick={() => handleScopeChange(0)}
                className="bg-[#27A376] text-white border border-green-500 
                  px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                  text-sm sm:text-lg font-semibold flex items-center 
                  hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                <ArrowLeftOutlined className="mr-2" /> Back to Template Details
              </Button>
            )}

            {/* Previous Page in Scope 1 */}
            {pageChange > 0 && (
              <Button
                onClick={() => setPageChange(pageChange - 1)}
                className="bg-[#27A376] text-white border border-green-500 
                          px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                <ArrowLeftOutlined className="mr-2" /> Previous
              </Button>
            )}

            {/* Next Page in Scope 1 */}
            {pageChange < 2 && (
              <Button
                onClick={() => setPageChange(pageChange + 1)}
                className="bg-[#27A376] text-white border border-green-500 
                          px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                Next <ArrowRightOutlined className="ml-2" />
              </Button>
            )}

            {/* Go to Scope 2 */}
            {pageChange === 2 && (
              <Button
                onClick={() => handleScopeChange(2)}
                className="bg-[#27A376] text-white border border-green-500 
                          px-4 sm:px-6 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                Go to Scope 2 <ArrowRightOutlined className="ml-2" />
              </Button>
            )}
          </>
        )}

        {/* Scope 2 Navigation */}
        {changeShope === 2 && (
          <>
            {/* Back to Scope 1 */}
            {pageChange === 0 && (
              <Button
                onClick={() => handleScopeChange(1)}
                className="bg-[#27A376] text-white border border-green-500 
                  px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                  text-sm sm:text-lg font-semibold flex items-center 
                  hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                <ArrowLeftOutlined className="mr-2" /> Back to Scope 1
              </Button>
            )}

            {/* Previous Page in Scope 2 */}
            {pageChange > 0 && (
              <Button
                onClick={() => setPageChange(pageChange - 1)}
                className="bg-[#27A376] text-white border border-green-500 
                          px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                <ArrowLeftOutlined className="mr-2" /> Previous
              </Button>
            )}

            {/* Next Page in Scope 2 */}
            {pageChange < 2 && (
              <Button
                onClick={() => setPageChange(pageChange + 1)}
                className="bg-[#27A376] text-white border border-green-500 
                          px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                Next <ArrowRightOutlined className="ml-2" />
              </Button>
            )}

            {/* Go to Scope 3 */}
            {pageChange === 2 && (
              <Button
                onClick={handleSubmit}
                className="bg-[#27A376] text-white border border-green-500 
                          px-4 sm:px-6 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                Save Template <SaveOutlined />
              </Button>
            )}
          </>
        )}

        {/* Scope 3 Navigation */}
        {changeShope === 3 && (
          <>
            {/* Back to Scope 2 */}
            {pageChange === 0 && (
              <Button
                onClick={() => handleScopeChange(2)}
                className="bg-[#27A376] text-white border border-green-500 
                  px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                  text-sm sm:text-lg font-semibold flex items-center 
                  hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                <ArrowLeftOutlined className="mr-2" /> Back to Scope 2
              </Button>
            )}

            {/* Previous Page in Scope 3 */}
            {pageChange > 0 && (
              <Button
                onClick={() => setPageChange(pageChange - 1)}
                className="bg-[#27A376] text-white border border-green-500 
                          px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                <ArrowLeftOutlined className="mr-2" /> Previous
              </Button>
            )}

            {/* Next Page in Scope 3 */}
            {pageChange < 3 && (
              <Button
                onClick={() => setPageChange(pageChange + 1)}
                className="bg-[#27A376] text-white border border-green-500 
                          px-3 sm:px-5 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                Next <ArrowRightOutlined className="ml-2" />
              </Button>
            )}

            {/* Finish Button (on last page of Scope 3) */}
            {pageChange === 3 && (
              <Button
                onClick={() => {
                  // Handle completion - could navigate to dashboard or show completion message
                  console.log("Process completed!");
                }}
                className="bg-[#27A376] text-white border border-green-500 
                          px-4 sm:px-6 py-2 sm:py-3 rounded-lg 
                          text-sm sm:text-lg font-semibold flex items-center 
                          hover:bg-green-600 focus:ring-0 footer-for-scopes"
              >
                Finish <ArrowRightOutlined className="ml-2" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}
