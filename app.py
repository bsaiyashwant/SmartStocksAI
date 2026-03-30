import streamlit as st
import plotly.graph_objects as go

from auth import authenticate
from live_data import fetch_live_data
from spark_engine import analyze_with_spark
from signals import buy_sell_signal
from prediction import predict_price


st.set_page_config(layout="wide")

# ---------------- LOGIN ----------------
if "logged" not in st.session_state:
    st.session_state.logged = False

if not st.session_state.logged:
    st.title("🔐 Login")
    u = st.text_input("Username")
    p = st.text_input("Password", type="password")

    if st.button("Login"):
        if authenticate(u, p):
            st.session_state.logged = True
            st.rerun()
        else:
            st.error("Invalid credentials")
    st.stop()


# ---------------- SIDEBAR ----------------
st.sidebar.title("👤 User Panel")

if "wallet" not in st.session_state:
    st.session_state.wallet = 100000

st.sidebar.markdown(
    f"""
### 💰 Wallet Balance  
₹ {st.session_state.wallet}
"""
)

# ---------------- MAIN ----------------
st.title("SmartStocks AI")

symbol = st.selectbox(
    "Select Stock",
    ["SBIN.NS", "HDFCBANK.NS", "RELIANCE.NS", "INFY.NS", "TCS.NS"]
)

df = fetch_live_data(symbol)

if df is None:
    st.stop()

# 🔥 BIG DATA ANALYSIS USING SPARK
spark_result = analyze_with_spark(df)
row = spark_result.iloc[0]

st.metric("Avg Close", round(row["avg_close"],2))
st.metric("High", round(row["max_price"],2))
st.metric("Low", round(row["min_price"],2))
st.metric("Volume", int(row["total_volume"]))

signal = buy_sell_signal(df)
st.markdown(f"### 📌 Signal: **{signal}**")

if st.button("🤖 Predict Next Price"):
    pred = predict_price(df)
    st.success(f"Predicted: ₹{pred}")

# Candlestick
fig = go.Figure(data=[go.Candlestick(
    x=df["Date"],
    open=df["Open"],
    high=df["High"],
    low=df["Low"],
    close=df["Close"]
)])

fig.update_layout(template="plotly_dark")

st.plotly_chart(fig, width="stretch")