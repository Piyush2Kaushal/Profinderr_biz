import { Button } from "components/ui";

export default function TermsConditionsPage() {
  const content = `
    <h2>Terms & Conditions</h2>
    <p>Hello</p>
    <p>Before you create an account, Please read and accept our Terms & Conditions</p>
    <h3>Terms & Conditions</h3>
    <p>This is a static terms and conditions document.</p>
    <ul>
      <li>Not misuse the platform</li>
      <li>Comply with all laws</li>
      <li>Accept all liability</li>
    </ul>
  `;

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl 2xl:max-w-5xl">
        <h5 className="dark:text-dark-50 text-lg font-medium text-gray-800 capitalize">
          Terms & Conditions
        </h5>
        <div className="dark:bg-dark-500 my-5 h-px bg-gray-200" />

        <div
          className="prose prose-sm dark:prose-invert dark:text-dark-100 max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="mt-8 flex justify-end space-x-3">
          <Button className="min-w-[7rem]">Cancel</Button>
          <Button className="min-w-[7rem]" color="primary">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
