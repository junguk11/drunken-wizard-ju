// package
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import useSound from "use-sound";
// hooks
import useInput from "../hooks/useInput";
import { passwordCheckF } from "../hooks/useCheck";
import { useModal } from "../hooks/useModal";
import { useFocus } from "../hooks/useFocus";
// cookies
import { setCookie } from "../shared/Cookies";
// kakao
import { KAKAO_AUTH_URL } from "../shared/Kakao";
// interface
import { loginStateProps } from "../typings/db";
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
  LoginBtnBox,
  Check,
} from "../Components/UserComponents/UserStyled";
import {
  DefaultBtn,
  DefaultBtnKakao,
  FormWrapSt,
} from "../Components/Common/CommonStyle";
import OneBtnModal from "../elem/OneBtnModal";

// sounds
import btnSound from "../sounds/buttonSound.mp3";

const Login = ({ setLoginState }: loginStateProps) => {
  const navigate = useNavigate();
  const [username, setUsername, setUsernameValue] = useInput<string>("");
  const [password, setPassword, setPasswordValue] = useInput<string>("");
  const [idFocus, setIdFocus] = useFocus<boolean>(false);
  const [pwFocus, setPwFocus] = useFocus<boolean>(false);
  const [loginCheck, setLoginCheck] = useModal<boolean>(false);
  const [play] = useSound(btnSound);

  // mutate
  const { mutate } = useMutation(apis.loginMT, {
    onSuccess: (res) => {
      setCookie("token", res.headers.authorization, {
        path: "/",
        expire: "after60m",
      });
      setCookie("id", res.data.id, {
        path: "/",
        expire: "after60m",
      });
      setCookie("username", res.data.username, {
        path: "/",
        expire: "after60m",
      });
      setCookie("nickname", res.data.nickname, {
        path: "/",
        expire: "after60m",
      });
      setCookie("imageNum", res.data.imageNum, {
        path: "/",
        expire: "after60m",
      });
      navigate("/lobby");
      setLoginState(true);
    },
    onError: (error, e: any) => {
      navigate("/login");
      setLoginState(false);
      // console.log(error);
      setLoginCheck(e);
      setUsernameValue("");
      setPasswordValue("");
    },
  });

  // submit
  const handleLogin = useCallback(
    (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      mutate({ username, password });
    },
    [username, password, mutate]
  );

  return (
    <>
      <BackWrap>
        {loginCheck && (
          <OneBtnModal
            headerText={"????????? ????????? ?????????????????????!"}
            upperText={"???????????? ??????????????????."}
            lowerText={""}
            confirmText={"??????"}
            clickFunc={setLoginCheck}
          />
        )}
        <FormWrapSt>
          <LogLogo top={12.729} bottom={4.6875} />
          <form>
            <label id="user-id-label">
              <InputBoxId>
                <Input
                  type="text"
                  id="user-id"
                  name="user-id"
                  value={username}
                  onChange={setUsername}
                  placeholder="ID"
                  onFocus={setIdFocus}
                  onBlur={setIdFocus}
                />
                {username === "" && idFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ???????????? <br />
                      ??????????????????.
                    </span>
                  </SpeechBubble>
                )}
                {username !== "" && idFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ????????? ????????? <br />
                      ID ?????????.
                    </span>
                  </SpeechBubble>
                )}
                {username !== "" && <Check>???</Check>}
              </InputBoxId>
            </label>
            <label id="password-label">
              <InputBoxPw>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={setPassword}
                  onFocus={setPwFocus}
                  onBlur={setPwFocus}
                />
                {passwordCheckF(password) && pwFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ????????? ????????? <br />
                      ???????????? ?????????.
                    </span>
                  </SpeechBubble>
                )}
                {!passwordCheckF(password) && pwFocus && (
                  <SpeechBubble>
                    <span className="bubble__notice">
                      ??????, ??????, <br /> ???????????? ?????? <br />
                      6~15???
                    </span>
                  </SpeechBubble>
                )}
                {passwordCheckF(password) && <Check>???</Check>}
              </InputBoxPw>
            </label>
          </form>
          <LoginBtnBox>
            <DefaultBtn
              btnType="activeM"
              size={10.9895}
              onClick={(e) => {
                play();
                handleLogin(e);
              }}
              type="submit"
              disabled={username === "" || password === "" ? true : false}
            >
              <span>Login</span>
            </DefaultBtn>
            <Link to="/signup">
              <DefaultBtn
                btnType="inactiveM"
                size={10.9895}
                onClick={() => {
                  play();
                }}
              >
                <span>Register</span>
              </DefaultBtn>
            </Link>
          </LoginBtnBox>
          <a href={KAKAO_AUTH_URL}>
            <DefaultBtnKakao
              btnType="kakao"
              size={22.82}
              onClick={() => {
                play();
              }}
              style={{ marginBottom: "2.77vw" }}
            ></DefaultBtnKakao>
          </a>
        </FormWrapSt>
      </BackWrap>
    </>
  );
};

export default Login;
