import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const SecondFactor = ({ history, location }) => {
  const [question, setQuestion] = useState("Select the question");
  const [questionError, setQuestionError] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const uid = location?.state?.uid || null;

  const onChangeHandler = (e) => {
    setError("");
    const { name, value } = e.target;
    if (name === "question") {
      setQuestion(value);
      value !== "Select the question"
        ? setQuestionError("")
        : setQuestionError("Please select the question");
    } else if (name === "answer") {
      setAnswer(value);
      value ? setAnswerError("") : setAnswerError("Value is Required");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!(question && answer)) {
      setError("Please fill all mandatory fields");
      setLoading(false);
      return false;
    }
    if (questionError || answerError) {
      setError("Please check the error");
      setLoading(false);
      return false;
    }

    const response = await axios.post(
      `https://dhrzvmfzw6.execute-api.us-east-1.amazonaws.com/dev/users`,
      {
        uid,
        question,
        answer,
      }
    );
    if (response.data.body) {
      setLoading(false);
      setError("User registered Successfully");
      history.push("/login");
    } else {
      await axios.delete(
        `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/deleteUser/${uid}`
      );

      await axios.delete(
        `https://us-central1-clear-gantry-283402.cloudfunctions.net/app/deleteUserDetails/${uid}`
      );

      setError("Error Occured... User not registered");
      setLoading(false);
      history.push("/register");
      return false;
    }

    setLoading(false);
  };

  return (
    <>
      <Container>
        <br></br>
        <Row>
          <Col sm={6}>
            <h1>Enter Security Question and Answer</h1>
            <Form>
              <Form.Group controlId="formQuestion">
                <Form.Label>Question*</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                  value={question}
                  name="question"
                >
                  <option value="Select the question" hidden>
                    Select the question
                  </option>
                  <option value="What is your favourite destination?">
                    What is your favourite destination?
                  </option>
                  <option value="What is the name of your first pet?">
                    What is the name of your first pet?
                  </option>
                  <option value="what is the name of your oldest cousin?">
                    what is the name of your oldest cousin?
                  </option>
                </Form.Control>
                <div>{questionError}</div>
              </Form.Group>
              <Form.Group controlId="formAnswer">
                <Form.Label>Answer*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Answer"
                  name="answer"
                  value={answer}
                  onChange={onChangeHandler}
                  onBlur={onChangeHandler}
                />
                <div>{answerError}</div>
              </Form.Group>
              <h4>{error}</h4>
              <Button
                variant="primary"
                onClick={onSubmitHandler}
                disabled={loading}
              >
                {loading && (
                  <i
                    className="fa fa-refresh fa-spin"
                    style={{ marginRight: "5px" }}
                  ></i>
                )}
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SecondFactor;
