import yfinance as yf

def fetch_live_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="1d", interval="1m")

        if df.empty:
            return None

        df.reset_index(inplace=True)
        df.rename(columns={"Datetime": "Date"}, inplace=True)

        df["Symbol"] = symbol
        return df.tail(100)

    except:
        return None