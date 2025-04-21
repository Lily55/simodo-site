import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Post from "./Post";

const mockedProps = {
  id: 5,
  Title: "Title",
  Description: "Description",
  Username: "Masha",
  Answers: [{ answerName: "Ilya", answerText: "Text" }],
};

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

describe("Тестируем Post", () => {
  it("Post рендерится", () => {
    render(<Post {...mockedProps} />);

    const post = screen.getByTestId("POST_TEST_ID");

    expect(post).toBeInTheDocument();
  });

  it("В Post добавляется ответ", async () => {
    render(<Post {...mockedProps} />);

    const button = screen.getByTestId("ADD_ANSWER_BUTTON_TEST_ID");

    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    const answersCount = screen.getByTestId("ANSWERS_COUNT_TEST_ID");

    expect(answersCount).toHaveTextContent("1");
  });

  it("В Post показываются ответы", async () => {
    render(<Post {...mockedProps} />);

    const button = screen.getByTestId("ADD_ANSWER_BUTTON_TEST_ID");

    const textarea = screen.getByTestId("TEXTAREA_TEST_ID");

    await userEvent.type(textarea, "textarea");

    await userEvent.click(button);

    const buttonShow = screen.getByTestId("SHOW_ANSWERS_BUTTON_TEST_ID");

    await userEvent.click(buttonShow);

    const answer = screen.getByTestId("ANSWER_TEST_ID");

    expect(answer).toBeInTheDocument();
  });
});
