import React from "react";
import { Form, Link } from "react-router-dom";

export function PostForm({
  users,
  isSubmitting,
  errors = {},
  defaultValues = {},
}) {
  console.log({ defaultValues });
  return (
    <Form method="post" className="form">
      <div className="form-row">
        <div className={`form-group ${errors?.title ? "error" : ""}`}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            defaultValue={defaultValues?.title}
          />
          <div className={errors?.title ? "error-message" : ""}>
            {errors?.title}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="userId">Author</label>
          <select
            name="userId"
            id="userId"
            defaultValue={defaultValues?.userId}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className={`form-group ${errors?.body ? "error" : ""}`}>
          <label htmlFor="body">Body</label>
          <textarea
            name="body"
            id="body"
            defaultValue={defaultValues?.body}
          ></textarea>
          <div className={errors?.body ? "error-message" : ""}>
            {errors?.body}
          </div>
        </div>
      </div>
      <div className="form-row form-btn-row">
        <Link className="btn btn-outline" to={".."}>
          Cancel
        </Link>
        <button className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Save"}
        </button>
      </div>
    </Form>
  );
}

export function postFormValidator({ title, body, userId }) {
  const errors = {};

  if (title === "") {
    errors.title = "Title is required";
  }

  if (body === "") {
    errors.body = "Body is required";
  }

  if (userId === "") {
    errors.userId = "Athor is required";
  }

  return errors;
}
