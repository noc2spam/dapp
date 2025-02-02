import React from "react";
import moment from "moment";
import { useContext } from "context";
import storage from "helpers/storage";
import { newWalletProvider } from "context/state";

export const useWebWalletLogin = ({
  callbackRoute,
  token,
}: {
  callbackRoute: string;
  token?: string;
}) => {
  const { dapp, network } = useContext();
  return () => {
    dapp.provider = newWalletProvider(network);
    dapp.provider
      .init()
      .then((initialised) => {
        if (initialised) {
          // Wallet provider will redirect, we can set a session information so we know when we are getting back
          //  that we initiated a wallet provider login
          storage.session.setItem({
            key: "walletLogin",
            data: {},
            expires: moment().add(1, "minutes").unix(),
          });
          dapp.provider.login({
            callbackUrl: encodeURIComponent(
              `${window.location.origin}${callbackRoute}`
            ),
            ...(token ? { token } : {}),
          });
        } else {
          console.warn(
            "Something went wrong trying to redirect to wallet login.."
          );
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };
};

const WalletLogin = ({
  callbackRoute,
  token,
  webWalletButtonLabel,
}: {
  callbackRoute: string;
  token?: string;
  webWalletButtonLabel: string;
}) => {
  const webWalletLogin = useWebWalletLogin({ callbackRoute, token });

  return (
    <button
      onClick={webWalletLogin}
      className="btn btn-primary px-sm-4 m-1 mx-sm-3"
      data-testid="walletLink"
    >
      {webWalletButtonLabel}
    </button>
  );
};

export default WalletLogin;
