"use client";

import DOMPurify from "isomorphic-dompurify";

// Story is Quill-authored HTML submitted by campaign creators (arbitrary
// users), not trusted markup — it must be sanitized before rendering to
// avoid stored XSS from a malicious campaign submission.
const Story = ({ story }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Story</h3>
      {story ? (
        <div
          className="text-gray-600 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story) }}
        />
      ) : (
        <p className="text-gray-600">No story has been added yet.</p>
      )}
    </div>
  );
};

export default Story;
