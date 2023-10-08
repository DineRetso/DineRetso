import React from "react";

export default function SignupTermsandConditions(props) {
  const { handleCheckBox } = props;
  return (
    <div
      className='overflow-y-scroll max-h-40 border bg-neutrals-400 border-gray-300 p-2 rounded'
      style={{ maxHeight: "160px" }}
    >
      <p>
        <strong>Terms and Conditions for Using DineRetso</strong>
      </p>
      <p>
        Welcome to DineRetso! By signing up and using our website, you agree to
        the following terms and conditions regarding the collection, use, and
        protection of your user information:
      </p>
      <ol>
        <li>
          <strong>User Information</strong>
          <ol>
            <li>
              1.1. Upon signing up for DineRetso to use its services, you may be
              required to provide certain personal information such as your
              name, email address, and contact details.
            </li>
            <li>
              1.2. You are responsible for ensuring the accuracy and
              completeness of the information you provide during sign-up to
              successfully use DineRetso.
            </li>
          </ol>
        </li>
        <li>
          <strong>Use of User Information:</strong>
          <ol>
            <li>
              2.1. We may use the information you provide to personalize your
              experience on DineRetso, provide relevant recommendations, and
              improve our services.
            </li>
            <li>
              2.2. Your email information may be used to communicate with you
              about updates, promotions, and important announcements related to
              DineRetso.
            </li>
            <li>
              2.3. We will not share, sell, or rent your personal information to
              third parties without your explicit consent, except as required by
              law or to fulfill our services.
            </li>
            <li>
              2.4 We use collected data to enhance our website's functionality,
              and improve user experience.
            </li>
          </ol>
        </li>
        <li>
          <strong>Identification and Security:</strong>
          <ol>
            <li>
              3.1. DineRetso may employ identification measures, including but
              not limited to email verification to secure your account and
              prevent unauthorized access.
            </li>
            <li>
              3.2. You are responsible for maintaining the confidentiality of
              your account credentials and for any activities that occur under
              your account.
            </li>
          </ol>
        </li>
        <li>
          <strong>Data Protection:</strong>
          <ol>
            <li>
              4.1. We are committed to protecting your data. However, we cannot
              guarantee absolute security.
            </li>
            <li>
              4.2 We only protect your personal information internally but you
              are responsible for protecting your password and personal
              information outside the website. We are not held liable when a
              third party has access to it.
            </li>
          </ol>
        </li>
        <li>
          <strong>Third Party:</strong>
          <ol>
            <li>
              5.1. DineRetso may contain links to third-party like social media
              platform. We are not responsible for the privacy practices or
              content of these social media platform. Please review their
              respective privacy policies.
            </li>
            <li>
              5.2 We are not responsible in any data breach that might happen
              when you are using third parties platform.
            </li>
          </ol>
        </li>
        <li>
          <strong>Changes to Terms:</strong>
          <ol>
            <li>
              6.1. These terms and conditions may be updated from time to time.
              We will notify you of any significant changes.
            </li>
            <li>
              6.2. Your continued use of DineRetso after changes to the terms
              signifies your acceptance of the updated terms.
            </li>
          </ol>
        </li>
        <li>
          <strong>Termination:</strong>
          <ol>
            <li>
              7.1. We reserve the right to terminate or suspend your account if
              you violate these terms or engage in activities harmful to
              DineRetso or its users.
            </li>
            <li>
              7.2 You have the right to access, modify, or delete your personal
              information.
            </li>
          </ol>
        </li>
      </ol>
      <div className='mt-2'>
        <input
          className='mr-1'
          type='checkbox'
          id='terms'
          onChange={handleCheckBox}
          required
        />
        <label htmlFor='terms' className='text-BlackColor'>
          I agree to the Terms and Conditions.
        </label>
      </div>
    </div>
  );
}
