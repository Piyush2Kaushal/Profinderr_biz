import { Button } from "components/ui";

export default function PrivacyPolicyPage() {
  const content = `
    <h2>Privacy Policy</h2>
    <p>Hello</p>
    <p>Before you create an account, Please read and accept our Privacy Policy</p>
    <h3>1. Information We Collect</h3>
    <p>We collect minimal personal data necessary for service operation.</p>
    <h3>2. How We Use Your Data</h3>
    <p>Your data is used solely to provide and improve our services.</p>
    <h3>3. Data Protection</h3>
    <p>We implement industry-standard security measures.</p>
  `;

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl 2xl:max-w-5xl">
        <h5 className="dark:text-dark-50 text-lg font-medium text-gray-800 capitalize">
          Privacy Policy
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
