const { BadRequestError } = require("../core/error.response");
const config = require("../config/config");
const { default: axios } = require("axios");
const crypto = require('crypto');
const { createBooking, checkoutReviewBooking } = require("./booking.service");
const { findSeatByCode } = require("../models/repo/seat.repo");
const db = require("../models");


class PaymentService {
    // {
    //     "show_time_id": "0ecd89f7-e964-44eb-8af4-f23d99824021",
    //     "user_order_book": [
    //         {
    //             "type": "normal",
    //             "location": "A8"
    //         },
    //         {
    //             "type": "vip",
    //             "location": "D1"
    //         }
    //     ]
    // }
    static async paymentProcessInput({ userId, email, payload }) {
        const { show_time_id, user_order_book, snacks_order } = payload;
        const {
            accessKey, 
            autoCapture, 
            ipnUrl, 
            lang, 
            orderGroupId, 
            orderInfo, 
            partnerCode, 
            redirectUrl, 
            requestType, 
            secretKey
        } = config.development.payment;

        for (let i = 0; i < user_order_book.length; i++) {
            let foundSeat = await findSeatByCode(user_order_book[i].location, "booked", show_time_id);
            if (foundSeat) throw new BadRequestError(`Seat ${user_order_book[i].location} already booked!!`);
        }
        
        const { checkoutPrice, showtime, user_order } = await checkoutReviewBooking({
            show_time_id, payload: {
                user_order: user_order_book,
                snacks_order
            }
        });

        const bookingData  = { 
            userId, 
            email,
            checkoutPrice, 
            showtime, 
            user_order,
            snacks_order
        };

        const extraData = Buffer.from(JSON.stringify(bookingData)).toString('base64');

        console.log("total checkout ", checkoutPrice)
        var amount = String(checkoutPrice);

        var orderId = partnerCode + new Date().getTime();
        // console.log("orderId", orderId)
        var requestId = orderId;
        
        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        const rawSignature =
        'accessKey=' + accessKey +
        '&amount=' + amount +
        '&extraData=' + extraData +
        '&ipnUrl=' + ipnUrl +
        '&orderId=' + orderId +
        '&orderInfo=' + orderInfo +
        '&partnerCode=' + partnerCode +
        '&redirectUrl=' + redirectUrl +
        '&requestId=' + requestId +
        '&requestType=' + requestType;
        
        //signature
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        // console.log("signature", signature)
        // console.log("rawSignature", rawSignature)
        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        });

        console.log("request body ", requestBody)
        
        // options for axios
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };
        
        // Send the request and handle the response
        let result;
        result = await axios(options);
        return result.data;
    }

    static async paymentProcessCallback(data) {
        const { accessKey, secretKey } = config.development.payment;
        const {
            extraData,
            signature,
            amount,
            orderId,
            requestId,
            orderInfo,
            partnerCode,
            message,
            orderType,
            payType,
            responseTime,
            resultCode,
            transId
        } = data;
    
        // Construct rawSignature with parameters from Momo's IPN callback
        const rawSignature =
            'accessKey=' + accessKey +
            '&amount=' + amount +
            '&extraData=' + extraData +
            '&message=' + message +
            '&orderId=' + orderId +
            '&orderInfo=' + orderInfo +
            '&orderType=' + orderType +
            '&partnerCode=' + partnerCode +
            '&payType=' + payType +
            '&requestId=' + requestId +
            '&responseTime=' + responseTime +
            '&resultCode=' + resultCode +
            '&transId=' + transId;
    
        const expectedSignature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
    
        // console.log("expectedSignature", expectedSignature);
        // console.log("rawSignature", rawSignature);
    
        if (signature !== expectedSignature) {
            throw new BadRequestError('Invalid signature!');
        }
    
        // Rest of the code remains the same...
        const extraDataStr = Buffer.from(extraData, 'base64').toString('utf-8');
        const { userId, email, checkoutPrice, showtime, user_order, snacks_order } = JSON.parse(extraDataStr);
    
        const checkStatus = await PaymentService.checkStatusPayment({ orderId: data.orderId });
        if (checkStatus.resultCode !== 0) {
            throw new BadRequestError('Payment failed!');
        }

        const newBookingWithPending = await db.Booking.create({
            booking_roomId: showtime.room.room_id,
            booking_userId: userId,
            booking_movieId: showtime.movie.movie_id,
            booking_date: showtime.show_date,
            booking_total_checkout: checkoutPrice,
            booking_status: "pending",
            booking_show_time_id: showtime.show_time_id,
            payment_method: data.partnerCode.toLowerCase(),
            payment_order_id: data.orderId,
            payment_result_code: data.resultCode,
            payment_message: data.message,
            payment_transaction_id: data.transId,
        });
    
        const newBooking = await createBooking({ newBooking: newBookingWithPending, email, checkoutPrice, showtime, user_order });
        return newBooking;
    }

    static async checkStatusPayment(data) {
        const { orderId } = data;
        console.log("orderId ", orderId)
        const {
            accessKey,
            secretKey,
            partnerCode,
            lang
        } = config.development.payment;

        const rawSignature =
            `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`;

        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode,
            requestId: orderId,
            orderId,
            signature,
            lang,
        });

        // options for axios
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: { 'Content-Type': 'application/json' },
            data: requestBody,
        };

        const result = await axios(options);

        return result.data;
    }
}

module.exports = PaymentService