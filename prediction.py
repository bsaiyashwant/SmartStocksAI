import numpy as np
from sklearn.linear_model import LinearRegression

def predict_price(df):
    if len(df) < 10:
        return None

    X = np.arange(len(df)).reshape(-1,1)
    y = df["Close"].values

    model = LinearRegression()
    model.fit(X, y)

    future = [[len(df)]]
    pred = model.predict(future)[0]

    return round(pred, 2)