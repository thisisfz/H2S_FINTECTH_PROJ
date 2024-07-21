import React, { ChangeEvent, useEffect, useState } from "react";
import CardNum from "./CardNum";

const CreditCard = () => {
  const initialCredit = {
    cardNumber: "",
    username: "",
    amount: "",
    validThru: {
      month: "",
      year: "",
    },
    cvv: "",
  };
  const initialNum = {
    first: "",
    second: "",
    third: "",
    fourth: "",
  };

  const [creditInput, setCreditInput] = useState({
    cardNumber: "",
    username: "",
    amount: "",
    validThru: {
      month: "",
      year: "",
    },
    cvv: "",
  });
  const [numInput, setNumInput] = useState(initialNum);

  const [fraudState, setFraudState] = useState({
    loading: false,
    fraud: -1,
    disabled: true,
  });

  const handleUserName = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value && Number(value.at(-1))) return;
    setCreditInput((prev) => ({ ...prev, username: value }));
    // setUsername(value);
  };

  const handleValidThru = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // if (value && value != "0" && !Number(value)) return;
    if (
      (name == "month" && Number(value) && Number(value) > 12) ||
      (value && Number(value) <= 0)
    )
      return;

    setCreditInput((prev) => ({
      ...prev,
      validThru: { ...prev.validThru, [name]: value },
    }));
  };

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value && !Number(value)) return;
    setCreditInput((prev) => ({ ...prev, amount: value }));
    // setAmount(value);
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFraudState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch("/api/v1/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: creditInput.username,
          creditCardNumber: creditInput.cardNumber,
          validThrough: String(
            (creditInput.validThru.month.length == 2
              ? creditInput.validThru.month
              : "0" + creditInput.validThru.month) +
              "/" +
              creditInput.validThru.year
          ),
          cvv: creditInput.cvv,
          amount: Number(creditInput.amount),
        }),
      });

      const result = await response.json();
      console.log(result);

      setFraudState((prev) => ({ ...prev, fraud: result.isFraud }));
      handleFraudState(result.isFraud);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      !creditInput.amount ||
      !creditInput.cvv ||
      !creditInput.username ||
      !creditInput.validThru.month ||
      !creditInput.validThru.year ||
      (creditInput.cardNumber.length != 16)
    )
      return;

    setFraudState({
      loading: false,
      fraud: -1,
      disabled: false,
    });
  }, [creditInput]);

  const handleFraudState = (fraud: boolean) => {
    const creditCard = document.querySelector(".credit-card");

    if (!creditCard) return;
    if (fraud) {
      creditCard.classList.add("fraud");
    } else if (!fraud) {
      creditCard.classList.add("not-fraud");
      setTimeout(() => {
        creditCard.classList.remove("not-fraud");
        creditCard.classList.remove("fraud");
      }, 3000);
    }

    const debounce = setTimeout(() => {
      creditCard.classList.remove("not-fraud");
      creditCard.classList.remove("fraud");
      setFraudState({
        disabled: true,
        fraud: -1,
        loading: false,
      });
      setCreditInput(initialCredit);
      setNumInput(initialNum);
    }, 3000);

    return () => clearTimeout(debounce);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-full flex flex-col">
      <div
        className={`credit-card ${
          fraudState.fraud == 0 ? "bg-transparent" : "bg-slate-900"
        }`}
      >
        <div
          className="credit-overlay -z-10"
          style={{ width: `${fraudState.fraud == 0 ? "100%" : "0"}` }}
        />
        <div className="flex justify-between w-full items-center">
          <h2 className="font-medium text-white">Credit</h2>
          <img src="/visa.svg" alt="" className="w-[72px] h-[48px]" />
        </div>

        <div className="w-full">
          <CardNum
            numInput={numInput}
            setNumInput={setNumInput}
            containerStyles="mb-3"
            handleCardNum={(value: string) =>
              setCreditInput((prev) => ({ ...prev, cardNumber: value }))
            }
          />
          <div className="flex justify-between items-end mb-3 gap-1 w-full">
            <input
              type="text"
              name="username"
              className="credit-user text-white uppercase tracking-widest w-full flex-1"
              placeholder="Your Name"
              value={creditInput.username}
              onChange={handleUserName}
            />

            <div id="validity" className="validity">
              <p className="text-white text-xs mb-1">Valid thru</p>
              <div className="valid-thru">
                <input
                  type="text"
                  name="month"
                  maxLength={2}
                  minLength={1}
                  value={creditInput.validThru.month}
                  onChange={handleValidThru}
                  placeholder="mm"
                />
                <span className="mx-2 text-white text-lg">/</span>
                <input
                  type="text"
                  name="year"
                  maxLength={2}
                  minLength={2}
                  value={creditInput.validThru.year}
                  onChange={handleValidThru}
                  placeholder="yy"
                />
              </div>
            </div>
          </div>
          <div
            id="payment"
            className="flex gap-1 items-end justify-between h-[42px] space-x-2-x-4"
          >
            <div className="flex-1 flex items-center h-full border-2">
              <select
                defaultValue={"INR"}
                className="currency"
                id="currency"
                name="currency"
              >
                <option value="AFN">AFN</option>
                <option value="ALL">ALL</option>
                <option value="DZD">DZD</option>
                <option value="AOA">AOA</option>
                <option value="ARS">ARS</option>
                <option value="AMD">AMD</option>
                <option value="AWG">AWG</option>
                <option value="AUD">AUD</option>
                <option value="AZN">AZN</option>
                <option value="BSD">BSD</option>
                <option value="BHD">BHD</option>
                <option value="BDT">BDT</option>
                <option value="BBD">BBD</option>
                <option value="BYR">BYR</option>
                <option value="BEF">BEF</option>
                <option value="BZD">BZD</option>
                <option value="BMD">BMD</option>
                <option value="BTN">BTN</option>
                <option value="BTC">BTC</option>
                <option value="BOB">BOB</option>
                <option value="BAM">BAM</option>
                <option value="BWP">BWP</option>
                <option value="BRL">BRL</option>
                <option value="GBP">GBP</option>
                <option value="BND">BND</option>
                <option value="BGN">BGN</option>
                <option value="BIF">BIF</option>
                <option value="KHR">KHR</option>
                <option value="CAD">CAD</option>
                <option value="CVE">CVE</option>
                <option value="KYD">KYD</option>
                <option value="XOF">XOF</option>
                <option value="XAF">XAF</option>
                <option value="XPF">XPF</option>
                <option value="CLP">CLP</option>
                <option value="CNY">CNY</option>
                <option value="COP">COP</option>
                <option value="KMF">KMF</option>
                <option value="CDF">CDF</option>
                <option value="CRC">CRC</option>
                <option value="HRK">HRK</option>
                <option value="CUC">CUC</option>
                <option value="CZK">CZK</option>
                <option value="DKK">DKK</option>
                <option value="DJF">DJF</option>
                <option value="DOP">DOP</option>
                <option value="XCD">XCD</option>
                <option value="EGP">EGP</option>
                <option value="ERN">ERN</option>
                <option value="EEK">EEK</option>
                <option value="ETB">ETB</option>
                <option value="EUR">EUR</option>
                <option value="FKP">FKP</option>
                <option value="FJD">FJD</option>
                <option value="GMD">GMD</option>
                <option value="GEL">GEL</option>
                <option value="DEM">DEM</option>
                <option value="GHS">GHS</option>
                <option value="GIP">GIP</option>
                <option value="GRD">GRD</option>
                <option value="GTQ">GTQ</option>
                <option value="GNF">GNF</option>
                <option value="GYD">GYD</option>
                <option value="HTG">HTG</option>
                <option value="HNL">HNL</option>
                <option value="HKD">HKD</option>
                <option value="HUF">HUF</option>
                <option value="ISK">ISK</option>
                <option value="INR">INR</option>
                <option value="IDR">IDR</option>
                <option value="IRR">IRR</option>
                <option value="IQD">IQD</option>
                <option value="ILS">ILS</option>
                <option value="ITL">ITL</option>
                <option value="JMD">JMD</option>
                <option value="JPY">JPY</option>
                <option value="JOD">JOD</option>
                <option value="KZT">KZT</option>
                <option value="KES">KES</option>
                <option value="KWD">KWD</option>
                <option value="KGS">KGS</option>
                <option value="LAK">LAK</option>
                <option value="LVL">LVL</option>
                <option value="LBP">LBP</option>
                <option value="LSL">LSL</option>
                <option value="LRD">LRD</option>
                <option value="LYD">LYD</option>
                <option value="LTL">LTL</option>
                <option value="MOP">MOP</option>
                <option value="MKD">MKD</option>
                <option value="MGA">MGA</option>
                <option value="MWK">MWK</option>
                <option value="MYR">MYR</option>
                <option value="MVR">MVR</option>
                <option value="MRO">MRO</option>
                <option value="MUR">MUR</option>
                <option value="MXN">MXN</option>
                <option value="MDL">MDL</option>
                <option value="MNT">MNT</option>
                <option value="MAD">MAD</option>
                <option value="MZM">MZM</option>
                <option value="MMK">MMK</option>
                <option value="NAD">NAD</option>
                <option value="NPR">NPR</option>
                <option value="ANG">ANG</option>
                <option value="TWD">TWD</option>
                <option value="NZD">NZD</option>
                <option value="NIO">NIO</option>
                <option value="NGN">NGN</option>
                <option value="KPW">KPW</option>
                <option value="NOK">NOK</option>
                <option value="OMR">OMR</option>
                <option value="PKR">PKR</option>
                <option value="PAB">PAB</option>
                <option value="PGK">PGK</option>
                <option value="PYG">PYG</option>
                <option value="PEN">PEN</option>
                <option value="PHP">PHP</option>
                <option value="PLN">PLN</option>
                <option value="QAR">QAR</option>
                <option value="RON">RON</option>
                <option value="RUB">RUB</option>
                <option value="RWF">RWF</option>
                <option value="SVC">SVC</option>
                <option value="WST">WST</option>
                <option value="SAR">SAR</option>
                <option value="RSD">RSD</option>
                <option value="SCR">SCR</option>
                <option value="SLL">SLL</option>
                <option value="SGD">SGD</option>
                <option value="SKK">SKK</option>
                <option value="SBD">SBD</option>
                <option value="SOS">SOS</option>
                <option value="ZAR">ZAR</option>
                <option value="KRW">KRW</option>
                <option value="XDR">XDR</option>
                <option value="LKR">LKR</option>
                <option value="SHP">SHP</option>
                <option value="SDG">SDG</option>
                <option value="SRD">SRD</option>
                <option value="SZL">SZL</option>
                <option value="SEK">SEK</option>
                <option value="CHF">CHF</option>
                <option value="SYP">SYP</option>
                <option value="STD">STD</option>
                <option value="TJS">TJS</option>
                <option value="TZS">TZS</option>
                <option value="THB">THB</option>
                <option value="TOP">TOP</option>
                <option value="TTD">TTD</option>
                <option value="TND">TND</option>
                <option value="TRY">TRY</option>
                <option value="TMT">TMT</option>
                <option value="UGX">UGX</option>
                <option value="UAH">UAH</option>
                <option value="AED">AED</option>
                <option value="UYU">UYU</option>
                <option value="USD">USD</option>
                <option value="UZS">UZS</option>
                <option value="VUV">VUV</option>
                <option value="VEF">VEF</option>
                <option value="VND">VND</option>
                <option value="YER">YER</option>
                <option value="ZMK">ZMK</option>
              </select>
              <input
                type="text"
                value={creditInput.amount}
                onChange={handleAmount}
                className="amount bg-black w-full"
                placeholder="Enter Amount"
              />
            </div>
            <input
              type="text"
              maxLength={3}
              minLength={3}
              className="cvv"
              placeholder="CVV"
              value={creditInput.cvv}
              onChange={(e) => {
                Number(e.target.value)
                  ? setCreditInput((prev) => ({ ...prev, cvv: e.target.value }))
                  : "";
              }}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`btn transition-all  text-white verify-btn ${
          fraudState.fraud == 1
            ? "bg-red-500"
            : fraudState.fraud == 0
            ? "bg-green-500"
            : "bg-blue-500"
        }`}
        disabled={fraudState.disabled}
      >
        {fraudState.fraud == 1
          ? "Fraud Detected"
          : fraudState.fraud == 0
          ? "Valid Transaction"
          : "Check"}
      </button>
    </form>
  );
};

export default CreditCard;
