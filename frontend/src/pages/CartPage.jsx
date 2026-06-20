import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCart, removeFromCart, updateCartItem, checkoutCart } from "../store/cartSlice";

export default function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { items, loading, error } = useSelector((state) => state.cart);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [processing, setProcessing] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const total = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const handleCashCheckout = async () => {
        setProcessing(true);
        try {
            await dispatch(checkoutCart({ paymentMethod: "cash" })).unwrap();
            setDialogOpen(false);
            setSnackbar({ open: true, message: t("orderSuccess"), severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: err || "Checkout failed", severity: "error" });
        } finally {
            setProcessing(false);
        }
    };

    const handlePayPalApprove = async (data) => {
        setProcessing(true);
        try {
            await dispatch(
                checkoutCart({ paymentMethod: "paypal", paypalOrderId: data.orderID })
            ).unwrap();
            setDialogOpen(false);
            setSnackbar({ open: true, message: t("orderSuccess"), severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: err || "Checkout failed", severity: "error" });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom
                sx={{
                textAlign:"center"
            }}
            >
                {t("cart")}
            </Typography>

            <Stack spacing={2}>
                {items.map((item) => (
                    <Card key={item.productId} sx={{ display: "flex", gap: 2, p: 1 }}>
                        <CardMedia
                            component="img"
                            image={item.image}
                            alt={item.title}
                            sx={{ width: 120, borderRadius: 2 }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6">{item.title}</Typography>
                            <Typography>{t("price")}: ${item.price}</Typography>
                            <TextField
                                label={t("quantity")}
                                type="number"
                                size="small"
                                value={item.quantity}
                                onChange={(e) =>
                                    dispatch(
                                        updateCartItem({
                                            productId: item.productId,
                                            quantity: Number(e.target.value)
                                        })
                                    )
                                }
                                sx={{ mt: 1, width: 120 }}
                            />
                        </CardContent>
                        <Stack direction="column" justifyContent="center" spacing={1} sx={{ pr: 1 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => navigate(`/products/${item.productId}`)}
                            >
                                {t("view_product")}
                            </Button>
                            <IconButton onClick={() => dispatch(removeFromCart(item.productId))}>
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    </Card>
                ))}
            </Stack>

            {items.length === 0 && <Typography sx={{ mt: 2 }}>Empty cart</Typography>}

            {/* Total & Checkout */}
            {items.length > 0 && (
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        boxShadow: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2
                    }}
                >
                    <Typography variant="h5" fontWeight="bold">
                        {t("total")}: ${total.toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<ShoppingCartCheckoutIcon />}
                        onClick={() => setDialogOpen(true)}
                        sx={{ px: 4 }}
                    >
                        {t("checkout")}
                    </Button>
                </Box>
            )}

            {/* Payment Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => !processing && setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{t("choosePayment")}</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {t("total")}: ${total.toFixed(2)}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <FormControlLabel
                            value="cash"
                            control={<Radio />}
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <LocalAtmIcon color="success" />
                                    <Typography>{t("cash")}</Typography>
                                </Box>
                            }
                        />
                        <FormControlLabel
                            value="paypal"
                            control={<Radio />}
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <img
                                        src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                                        alt="PayPal"
                                        style={{ height: 22 }}
                                    />
                                    <Typography>{t("paypal")}</Typography>
                                </Box>
                            }
                        />
                    </RadioGroup>

                    {/* PayPal Buttons */}
                    {paymentMethod === "paypal" && (
                        <Box sx={{ mt: 2 }}>
                            <PayPalScriptProvider
                                options={{
                                    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                                    currency: "USD"
                                }}
                            >
                                <PayPalButtons
                                    style={{ layout: "vertical", label: "pay" }}
                                    disabled={processing}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: total.toFixed(2)
                                                    }
                                                }
                                            ]
                                        });
                                    }}
                                    onApprove={(data) => handlePayPalApprove(data)}
                                    onError={() => {
                                        setSnackbar({
                                            open: true,
                                            message: "PayPal payment failed",
                                            severity: "error"
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} disabled={processing}>
                        Cancel
                    </Button>
                    {paymentMethod === "cash" && (
                        <Button
                            variant="contained"
                            onClick={handleCashCheckout}
                            disabled={processing}
                            startIcon={<LocalAtmIcon />}
                        >
                            {processing ? t("processing") : t("placeOrder")}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}