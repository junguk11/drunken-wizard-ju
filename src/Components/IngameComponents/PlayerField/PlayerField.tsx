/* Package */
import React, { FunctionComponent, useState, useEffect } from "react";

/* Hooks */
import { useAppSelector, useAppDispatch } from "../../../hooks/tsHooks";
import { useParams } from "react-router-dom";
import useSound from "use-sound";
import cardSound from "../../../sounds/card.mp3";
/* Modules */
import {
  setSelectUseCardTK,
  setTargetTK,
} from "../../../redux/modules/ingameSlice";

/* Interface */
import {
  Card,
  PlayerFieldProps,
  playersSetting,
} from "../../../typings/typedb";

/* Components */
// import Cards from "./Cards";
import MyProfile from "./MyProfile";
/* CSS & SC */
import AlertPopUp from "../InGameCommon/AlertPopUp";
import {
  TurnBtn,
  PlayerFieldWrap,
  CardsArea,
  PlayerCtrlWrap,
  TargetBtn,
  TargetNullBtn,
  PlayerCards,
  DisCardBrn,
  TargetBtnBox,
  Divider,
  TurnTap,
  TurnHealBtn,
  SendHealBtn,
  ActionFailText,
} from "../InGameStyled/InGameStyled";

const PlayerField: FunctionComponent<PlayerFieldProps> = ({
  sendStompMsgFunc,
  status,
}) => {
  /* useState */
  const [healCnt, setHealCnt] = useState<boolean>(false);
  const [disableHeal, setDisableHeal] = useState<boolean>(false);
  const [play] = useSound(cardSound);
  // card Use & Discard
  const [target, setTarget] = useState(0);
  const [mouseIn, setMouseIn] = useState(false);
  const [clicked, setClicked] = useState(false);

  // alert modal
  const [useFail, setUseFail] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setClicked(false);
    }, 1000);

    setTimeout(() => {
      setUseFail(false);
    }, 1000);
  }, [clicked, useFail]);

  useEffect(() => {
    setDisableHeal(false);
    // setHealCnt(true);
  }, [status]);

  /* tookit things */
  const dispatch = useAppDispatch();
  // card Use & Targeting settings
  const selectedUseCard = useAppSelector(
    (state) => state.game.game.selectForUseCard
  );
  const selectedTarget = useAppSelector(
    (state) => state.game.game.targetPlayer
  );

  // find my states
  const nowPlayer = useAppSelector((state) => state.game.game.nowPlayerId);
  const thisPlayer = useAppSelector((state) => state.game.players.thisPlayer);
  const timerCtrl = useAppSelector((state) => state?.game.game.timer);
  // settings for make buttons
  const playersData = useAppSelector((state) => state.game.players);
  const playersList = Object.values(playersData);

  const { roomId } = useParams<{ roomId?: string }>();

  /* UseCard Functions */
  // ?????? ?????? ???????????? ????????????, ?????? ???????????? ???????????? ??????
  const onMouseOverCards = (
    event: React.MouseEvent<HTMLDivElement>,
    cardValue: Card
  ) => {
    setTarget(cardValue.cardId); // ???????????? ???????????? ??? ?????? item??? ????????? target ??????
    setMouseIn(Boolean(event)); // ????????? ?????? ??????
    dispatch(setSelectUseCardTK(cardValue));
  };

  // ????????? ????????? ????????? ?????? ?????????
  const onMouseLeaveCards = (event: React.MouseEvent<HTMLDivElement>) => {
    setTarget(0);
    setMouseIn(!event);
    dispatch(
      setSelectUseCardTK({
        cardName: "",
        target: "",
        cardId: 0,
        description: "",
        manaCost: 0,
      })
    );
  };

  // ????????? ?????? ?????????
  const onMouseOverTargeting = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: playersSetting
  ) => {
    dispatch(setTargetTK(value.playerId));
  };
  const onMouseLeaveTargeting = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    dispatch(setTargetTK(0));
  };

  // USECARD FUNC
  const cardUseHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: playersSetting | null
  ) => {
    if (value?.dead === true && value !== null) {
      setUseFail(true);
      return;
    } else {
      const data = {
        cardId: selectedUseCard.cardId,
        targetPlayerId: selectedTarget,
      };
      play();
      setClicked(true); // ???????????? ??????
      sendStompMsgFunc(roomId, thisPlayer.playerId, "USECARD", data);
    }
  };

  // DISCARD FUNC
  const discardHanlder = () => {
    const data = {
      cardId: selectedUseCard.cardId,
    };
    play();
    setClicked(true); // ???????????? ??????
    sendStompMsgFunc(roomId, thisPlayer.playerId, "DISCARD", data);
  };

  // about CSS function
  const generateClassName = (
    target: number,
    itemValue: number,
    isMouseIn: boolean
  ) => {
    if (itemValue === target && isMouseIn) {
      return "active";
    }
    if (itemValue === target || mouseIn) {
      return "normal";
    }
    return "default";
  };

  /* Healer ?????? ?????? */
  const openHealModalHandler = () => {
    setHealCnt(!healCnt);
  };

  const sendHealMsgHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: playersSetting
  ) => {
    console.log(value);
    if (value.dead === true) {
      setUseFail(true);
      return;
    } else {
      const data = {
        targetPlayerId: value.playerId,
        cardId: 0,
      };
      console.log(data);
      play();
      sendStompMsgFunc(roomId, thisPlayer.playerId, "USECARD", data);
      setHealCnt(false);
      setDisableHeal(true);
    }
  };

  // HEALER BTN(COMPONENT)
  const HealTargetBtns = playersList.map((value, index) => (
    <TurnHealBtn
      key={index}
      onClick={(event: any) => sendHealMsgHandler(event, value)}
      value={value.playerId}
      disabled={clicked}
      team={value.team}
      onMouseOver={(event: any) => onMouseOverTargeting(event, value)}
      onMouseLeave={onMouseLeaveTargeting}
    >
      {index === 0 && "E1"}
      {index === 1 && "E2"}
      {index === 2 && "AL"}
      {index === 3 && "ME"}
    </TurnHealBtn>
  ));

  /* ???????????? ?????? ????????? */

  // TARGETING BTN(COMPONENT) :: SELECT
  const TargetBtns = playersList.map((value, index) => (
    <TargetBtn
      key={value.playerId}
      onMouseOver={(event: any) => onMouseOverTargeting(event, value)}
      onMouseLeave={onMouseLeaveTargeting}
      onClick={(event: any) => cardUseHandler(event, value)}
      disabled={clicked}
      value={value.playerId}
      team={value.team}
    >
      {index === 0 && "E1"}
      {index === 1 && "E2"}
      {index === 2 && "AL"}
      {index === 3 && "ME"}
    </TargetBtn>
  ));

  // TARGETING BTN(COMPONENT) :: ME / ALLY / ENEMY
  const TargetNullBtns = ["ME", "ALLY", "ENEMY"].map((value, index: number) => (
    <TargetNullBtn
      key={index}
      color={value}
      onClick={(event: any) => cardUseHandler(event, null)}
      disabled={clicked}
    >
      {value}
    </TargetNullBtn>
  ));

  return (
    <>
      {useFail && (
        <AlertPopUp
          upperText="?????? ?????? ??????!"
          middleText="?????? ????????? ?????????????????????."
          bottomText=""
        ></AlertPopUp>
      )}
      <PlayerFieldWrap>
        <MyProfile></MyProfile>

        <CardsArea>
          <Divider></Divider>
          {thisPlayer.mutedDuration <= 0 ? (
            <>
              {thisPlayer.cardsOnHand.map((value: Card) => (
                <PlayerCards
                  key={value.cardId}
                  className={generateClassName(target, value.cardId, mouseIn)}
                  onMouseOver={(event: any) => onMouseOverCards(event, value)}
                  onMouseLeave={onMouseLeaveCards}
                  value={value}
                >
                  {nowPlayer === thisPlayer.playerId &&
                    value.target === "SELECT" &&
                    mouseIn &&
                    timerCtrl === "action" &&
                    target === value.cardId && (
                      <>
                        <TargetBtnBox>{TargetBtns}</TargetBtnBox>
                        <DisCardBrn onClick={discardHanlder}>?????????</DisCardBrn>
                      </>
                    )}
                  {nowPlayer === thisPlayer.playerId &&
                    value.target === "ME" &&
                    mouseIn &&
                    timerCtrl === "action" &&
                    target === value.cardId && (
                      <>
                        {TargetNullBtns[0]}
                        <DisCardBrn onClick={discardHanlder}>?????????</DisCardBrn>
                      </>
                    )}
                  {nowPlayer === thisPlayer.playerId &&
                    value.target === "ALLY" &&
                    mouseIn &&
                    timerCtrl === "action" &&
                    target === value.cardId && (
                      <>
                        {TargetNullBtns[1]}
                        <DisCardBrn onClick={discardHanlder}>?????????</DisCardBrn>
                      </>
                    )}
                  {nowPlayer === thisPlayer.playerId &&
                    value.target === "ENEMY" &&
                    mouseIn &&
                    timerCtrl === "action" &&
                    target === value.cardId && (
                      <>
                        {TargetNullBtns[2]}
                        <DisCardBrn onClick={discardHanlder}>?????????</DisCardBrn>
                      </>
                    )}
                </PlayerCards>
              ))}
            </>
          ) : (
            <>
              {thisPlayer.cardsOnHand.map((value: Card) => (
                <PlayerCards
                  key={value.cardId}
                  className={generateClassName(target, value.cardId, mouseIn)}
                  onMouseOver={(event: any) => onMouseOverCards(event, value)}
                  onMouseLeave={onMouseLeaveCards}
                  value={value}
                >
                  <DisCardBrn onClick={discardHanlder}>?????????</DisCardBrn>
                </PlayerCards>
              ))}
            </>
          )}
        </CardsArea>
        <div>
          <PlayerCtrlWrap>
            {thisPlayer.charactorClass === "HEALER" &&
              thisPlayer.mutedDuration <= 0 && (
                <>
                  <TurnTap>
                    {thisPlayer.playerId === nowPlayer && healCnt === true ? (
                      <>
                        <span>??? ?????? ??????</span>
                        <div className="turn__button--box">
                          {HealTargetBtns}
                        </div>
                      </>
                    ) : (
                      <>
                        <span>?????? ??????</span>
                        <div className="turn__button--box">
                          {playersList.map((value) => (
                            <TurnBtn key={value.turnOrder} team={value.team}>
                              {value.turnOrder}
                            </TurnBtn>
                          ))}
                        </div>
                      </>
                    )}
                  </TurnTap>
                  <SendHealBtn
                    disabled={disableHeal}
                    onClick={openHealModalHandler}
                  >
                    Heal
                  </SendHealBtn>
                </>
              )}

            {thisPlayer.charactorClass !== "HEALER" && (
              <TurnTap>
                <span>????????????</span>
                <div className="turn__button--box">
                  {playersList.map((value, index) => (
                    <TurnBtn key={index} team={value.team}>
                      {value.turnOrder}
                    </TurnBtn>
                  ))}
                </div>
              </TurnTap>
            )}
          </PlayerCtrlWrap>
        </div>
      </PlayerFieldWrap>
    </>
  );
};

export default PlayerField;
