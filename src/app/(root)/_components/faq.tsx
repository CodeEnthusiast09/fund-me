import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/accordion";

const FAQ = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 rounded-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        Frequently Asked Questions.
      </h2>
      <Accordion allowToggle>
        <AccordionItem className="border-t border-gray-200 py-2">
          <AccordionButton className="w-full py-4">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg sm:text-xl font-normal text-left">
                How Can I Make Donation?
              </h3>
              <AccordionIcon className="ml-4 text-gray-600" />
            </div>
          </AccordionButton>
          <AccordionPanel pb={4}>
            Donation information panel content
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className="border-t border-gray-200 py-2">
          <AccordionButton className="w-full py-4">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg sm:text-xl font-normal text-left">
                Is My Donation Tax-Deductible?
              </h3>
              <AccordionIcon className="ml-4 text-gray-600" />
            </div>
          </AccordionButton>
          <AccordionPanel pb={4}>
            Tax deduction information panel content
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className="border-t border-gray-200 py-2">
          <AccordionButton className="w-full py-4">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg sm:text-xl font-normal text-left">
                Can I Donate In Honor Or Memory Of Someone?
              </h3>
              <AccordionIcon className="ml-4 text-gray-600" />
            </div>
          </AccordionButton>
          <AccordionPanel pb={4}>
            Memorial donation information panel content
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className="border-t border-gray-200 py-2">
          <AccordionButton className="w-full py-4">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg sm:text-xl font-normal text-left">
                How Will My Donation Be Used?
              </h3>
              <AccordionIcon className="ml-4 text-gray-600" />
            </div>
          </AccordionButton>
          <AccordionPanel pb={4}>
            Donation usage information panel content
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem className="border-t border-gray-200 border-b py-2">
          <AccordionButton className="w-full py-4">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg sm:text-xl font-normal text-left">
                Can I Set Up A Recurring Donation?
              </h3>
              <AccordionIcon className="ml-4 text-gray-600" />
            </div>
          </AccordionButton>
          <AccordionPanel pb={4}>
            Recurring donation information panel content
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;
