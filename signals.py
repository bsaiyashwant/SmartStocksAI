def buy_sell_signal(df):
    if len(df) < 10:
        return "HOLD"

    short_ma = df["Close"].rolling(5).mean().iloc[-1]
    long_ma = df["Close"].rolling(10).mean().iloc[-1]

    if short_ma > long_ma:
        return "BUY"
    elif short_ma < long_ma:
        return "SELL"
    else:
        return "HOLD"