// package
import { Helmet } from "react-helmet";
import React, { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import useSound from "use-sound";
// hooks
import useInput from "../hooks/useInput";
import { idCheck, emailCheck, passwordCheckF } from "../hooks/useCheck";
import { useFocus } from "../hooks/useFocus";
import { useModal } from "../hooks/useModal";

// apis
import apis from "../shared/api/apis";
// css
import {
  BackWrap,
  LogLogo,
  Input,
  InputBoxId,
  InputBoxPw,
  SpeechBubble,
  ButtonBox,
  IdCheckButton,
  Check,
} from "../Components/UserComponents/UserStyled";
import OneBtnModal from "../elem/OneBtnModal";
import TwoBtnModal from "../elem/TwoBtnModal";
import { DefaultBtn } from "../Components/Common/CommonStyle";
import { FormWrapSt } from "../Components/Common/CommonStyle";
// sounds
import btnSound from "../sounds/buttonSound.mp3";

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [signUpCheckId, setSignUpCheckId] = useState<boolean>(false);
  const [nickname, setNickname, setNickValue] = useInput<string>("");
  const [email, setEmail, setEmailValue] = useInput<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [mismatchError, setMismatchError] = useState<boolean>(false);
  // modal
  const [signUpErrorModal, setSignUpErrorModal] = useModal<string>("");
  const [signUpSuccessModal, setSignUpSuccessModal] = useModal<boolean>(false);
  const [signUpCheckModal, setSignUpCheckModal] = useModal<boolean>(false);
  const [signUpCheckErrorModal, setSignUpCheckErrorModal] =
    useModal<boolean>(false);
  // focus
  const [idFocus, setIdFocus] = useFocus<boolean>(false);
  const [nickFocus, setNickFocus] = useFocus<boolean>(false);
  const [emailFocus, setEmailFocus] = useFocus<boolean>(false);
  const [pwFocus, setPwFocus] = useFocus<boolean>(false);
  const [pwCheckFocus, setPwCheckFocus] = useFocus<boolean>(false);
  const navigate = useNavigate();
  const [play, { stop }] = useSound(btnSound);

  // id disable ????????? ????????? ???????????? ??????????????? ????????? ????????? ?????????
  const idCheckDisabled = () => {
    if (!idCheck(username) === true) return true;
    if (username === "") return true;
    if (signUpCheckId === true) return true;
    else return false;
  };

  // button disable ????????? ??? ??? ????????? ????????? ????????? ????????? ????????????
  const disabledHandler = () => {
    if (idCheck(username) === false) return true;
    else if (signUpCheckId === false) return true;
    else if (password !== passwordCheck) return true;
    else if (emailCheck(email) === false) return true;
    else if (passwordCheckF(password) === false) return true;
    else if (
      username === "" ||
      password === "" ||
      passwordCheck === "" ||
      nickname === "" ||
      email === ""
    )
      return true;
    else return false;
  };

  // id onChangeEvent, ???????????? ?????? ??????????????? ????????? ?????? ?????????????????? ???
  const onChangeIdCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
      setSignUpCheckId(false);
    },
    [username]
  );

  // password onChangeEvent
  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck, setPassword]
  );
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password, setPasswordCheck]
  );

  // mutate

  // id check mutate
  const { mutate: signUpidCheck } = useMutation(apis.signUpIdCheckMT, {
    onMutate: () => {},
    onSuccess: (res, e: any) => {
      setSignUpCheckId(res.data);
      // console.log(res);
      if (res.data) {
        setSignUpCheckModal(e);
      } else {
        setSignUpCheckErrorModal(e);
      }
    },
    onError: (error: string) => {
      setSignUpCheckId(false);
      // console.log(error);
    },
  });

  // signUp mutate
  const { mutate: signUp } = useMutation(apis.signUpMT, {
    onSuccess: (e: any) => {
      // console.log(e);
      setSignUpSuccessModal(e);
      setUsername("");
      setNickValue("");
      setEmailValue("");
      setPassword("");
      setPasswordCheck("");
    },
    onError: (error: string, e: any) => {
      navigate("/signup");
      setSignUpErrorModal(e);
    },
  });

  // id check handler
  const onIdCheck = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      signUpidCheck({ username: username });
    },
    [username, signUpidCheck]
  );

  // submit handler
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!mismatchError) {
        signUp({
          username: username,
          nickname: nickname,
          email: email,
          password: password,
          passwordCheck: passwordCheck,
        });
      }
    },
    [username, nickname, email, password, passwordCheck, mismatchError, signUp]
  );
  // navigate
  const logNavigate = () => {
    navigate("/login");
  };
  return (
    <>
      <Helmet>
        <title>Drunken Wizard - Sign Up</title>
      </Helmet>
      <BackWrap>
        {signUpSuccessModal && (
          <TwoBtnModal
            confirmText={"Login"}
            cancelText={"Rejoin"}
            titleText={"???????????????!"}
            upperText={"????????? ?????? ???????????????."}
            lowerText={"???????????????  |  ???????????????"}
            confirmFunc={logNavigate}
            cancelFunc={setSignUpSuccessModal}
          />
        )}
        {signUpErrorModal && (
          <OneBtnModal
            headerText={"????????? ???????????? ??????????????????!"}
            upperText={""}
            lowerText={""}
            confirmText={"??????"}
            clickFunc={setSignUpErrorModal}
          />
        )}
        {signUpCheckModal && (
          <OneBtnModal
            headerText={"??????????????? ID?????????."}
            upperText={""}
            lowerText={""}
            confirmText={"??????"}
            clickFunc={setSignUpCheckModal}
          />
        )}
        {signUpCheckErrorModal && (
          <OneBtnModal
            headerText={"????????? ID?????????."}
            upperText={"?????? ID??? ??????????????????."}
            lowerText={""}
            confirmText={"??????"}
            clickFunc={setSignUpCheckErrorModal}
          />
        )}
        <FormWrapSt>
          <LogLogo top={10.208} bottom={2.604} />
          <form>
            <label id="user-id-label">
              <InputBoxId>
                <div>
                  <Input
                    type="text"
                    id="user-id"
                    name="user-id"
                    placeholder="ID"
                    maxLength={15}
                    value={username}
                    onChange={onChangeIdCheck}
                    onFocus={setIdFocus}
                    onBlur={setIdFocus}
                  />
                  {signUpCheckId ? (
                    <IdCheckButton
                      dup={true}
                      onClick={onIdCheck}
                      disabled={idCheckDisabled()}
                    >
                      Check
                    </IdCheckButton>
                  ) : (
                    <IdCheckButton
                      dup={false}
                      onClick={onIdCheck}
                      disabled={idCheckDisabled()}
                    >
                      Check
                    </IdCheckButton>
                  )}
                  {idCheck(username) &&
                    username !== "" &&
                    signUpCheckId === false &&
                    idFocus && (
                      <SpeechBubble>
                        <span className="bubble__notice">
                          ID?????? ?????????
                          <br />
                          ????????????.
                        </span>
                      </SpeechBubble>
                    )}
                  {idCheck(username) &&
                    username !== "" &&
                    signUpCheckId === true &&
                    idFocus && (
                      <SpeechBubble>
                        <span className="bubble__notice">
                          ???????????????
                          <br />
                          ID ?????????.
                        </span>
                      </SpeechBubble>
                    )}
                  {!idCheck(username) && username !== "" && idFocus && (
                    <SpeechBubble>
                      <span className="bubble__notice">
                        ????????? ????????? <br />
                        ????????? ????????????.
                      </span>
                    </SpeechBubble>
                  )}
                  {username === "" && idFocus && (
                    <SpeechBubble>
                      <span className="bubble__notice">
                        ???????????? <br />
                        ??????????????????.
                      </span>
                    </SpeechBubble>
                  )}
                </div>
              </InputBoxId>
            </label>
            <label id="nickname-label">
              <InputBoxId>
                <Input
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="NickName"
                  maxLength={5}
                  value={nickname}
                  onChange={setNickname}
                  onFocus={setNickFocus}
                  onBlur={setNickFocus}
                />
                {!nickname && nickFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ???????????? <br />
                      ??????????????????! <br />
                      1~5???
                    </span>
                  </SpeechBubble>
                )}
                {nickname && nickFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ??????????????? <br />
                      ??????????????????.
                    </span>
                  </SpeechBubble>
                )}
                {nickname && <Check>???</Check>}
              </InputBoxId>
            </label>
            <label id="email-label">
              <InputBoxId>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="E-Mail"
                  value={email}
                  onChange={setEmail}
                  onFocus={setEmailFocus}
                  onBlur={setEmailFocus}
                />
                {emailCheck(email) && emailFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ?????? ????????? <br />
                      ??????????????????.
                    </span>
                  </SpeechBubble>
                )}
                {!emailCheck(email) && emailFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ????????? <br />
                      ????????? ?????????
                      <br />
                      ????????????.
                    </span>
                  </SpeechBubble>
                )}
                {emailCheck(email) && <Check>???</Check>}
              </InputBoxId>
            </label>
            <label id="password-label">
              <InputBoxId>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  maxLength={15}
                  placeholder="PassWord"
                  onChange={onChangePassword}
                  onFocus={setPwFocus}
                  onBlur={setPwFocus}
                />
                {passwordCheckF(password) && pwFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ?????? ????????? <br />
                      ?????????????????????.
                    </span>
                  </SpeechBubble>
                )}
                {!passwordCheckF(password) && pwFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ??????, ??????, <br />
                      ?????? ?????? ?????? <br />
                      6~15???
                    </span>
                  </SpeechBubble>
                )}
                {passwordCheckF(password) && <Check>???</Check>}
              </InputBoxId>
            </label>
            <label id="password-check-label">
              <InputBoxPw>
                <Input
                  type="password"
                  id="password-check"
                  name="password-check"
                  placeholder="PassWordCheck"
                  maxLength={15}
                  value={passwordCheck}
                  onChange={onChangePasswordCheck}
                  onFocus={setPwCheckFocus}
                  onBlur={setPwCheckFocus}
                />
                {mismatchError && pwCheckFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ??????????????? <br />
                      ???????????? <br />
                      ????????????.
                    </span>
                  </SpeechBubble>
                )}
                {!mismatchError && pwCheckFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ??????????????? <br />
                      ???????????????.
                    </span>
                  </SpeechBubble>
                )}
                {!mismatchError && passwordCheck !== "" && <Check>???</Check>}
              </InputBoxPw>
            </label>
          </form>
          <ButtonBox>
            {disabledHandler() ? (
              <DefaultBtn btnType="inactiveM" size={10.9895}>
                <span>Sign up</span>
              </DefaultBtn>
            ) : (
              <DefaultBtn
                btnType="activeM"
                size={10.9895}
                onClick={(e) => {
                  onSubmit(e);
                  play();
                }}
                type="submit"
                disabled={disabledHandler()}
              >
                <span>Sign up</span>
              </DefaultBtn>
            )}
            <Link to="/login">
              <DefaultBtn
                btnType="inactiveM"
                size={10.9895}
                onClick={() => {
                  play();
                }}
              >
                <span>Cancel</span>
              </DefaultBtn>
            </Link>
          </ButtonBox>
        </FormWrapSt>
      </BackWrap>
    </>
  );
};

export default SignUp;
