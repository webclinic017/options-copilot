import React, { useState, useRef } from "react";
import {
  Drawer,
  Button,
  Form,
  Stack,
  InputNumber,
  DatePicker,
  Schema,
} from "rsuite";
import { useAddTrades } from "../hooks/TradeHooks/useAddTrades";
import { ManualTrade } from "../interfaces/trade";

const DrawerView = (props) => {
  const { user, onClose, handleModalSubmit, ...rest } = props;

  const { mutate } = useAddTrades();

  const { StringType, NumberType, DateType } = Schema.Types;

  const model = Schema.Model({
    symbol: StringType().isRequired("Symbol is Required"),
    strike: StringType()
      .isRequired("Strike is Required")
      .maxLength(14, "Strike is to long")
      .pattern(
        /\d{2}\/([A-z]{3}\/\d{2}\s)[0-9]{1,3}[c-p]/gi,
        "Please Enter strike in correct format"
      ),
    contractId: StringType()
      .isRequired("Contract ID is Required")
      .rangeLength(9, 9, "Contract Id must be 9 digits"),
    openDate: DateType().isRequired("Date is Required"),
    closeDate: DateType()
      .isRequired("Date is Required")
      .addRule((value, data) => {
        return value.toLocaleString() > data.openDate.toLocaleString();
      }, "Close Date must be greater then Open Date"),
    openTradePrice: NumberType()
      .isRequired("Trade Price Required")
      .min(0.1, "Minimum Price is 0.1"),
    closeTradePrice: NumberType()
      .isRequired("Trade Price Required")
      .min(0, "Minimum Price is 0"),
    quantity: NumberType()
      .isRequired("Quantity Required")
      .min(1, "Minimum quantity is 1"),
  });

  const formRef: any = useRef();
  const [formError, setFormError] = useState({});

  const intialState: ManualTrade = {
    symbol: "",
    strike: "",
    contractId: "",
    openDate: new Date(),
    closeDate: new Date(),
    openTradePrice: 0,
    closeTradePrice: 0,
    quantity: 0,
  };
  const [formValue, setFormValue] = useState(intialState);

  const handleSubmit = async () => {
    if (!formRef.current.check()) {
      console.log("errors", formError);
      return;
    }

    const formData: any = [
      {
        contract_id: Number(formValue.contractId),
        user_id: user.id,
        symbol: formValue.symbol.toUpperCase(),
        description: `${formValue.symbol.toUpperCase()} ${formValue.strike
          .replace(/\//g, "")
          .toUpperCase()}`,

        quantity: Number(formValue.quantity),
        trade_price: Number(formValue.openTradePrice),
        pnl_realized: 0,
        date_time: formValue.openDate.toLocaleString(),
      },
      {
        contract_id: Number(formValue.contractId),
        user_id: user.id,
        symbol: formValue.symbol.toUpperCase(),
        description: `${formValue.symbol.toUpperCase()} ${formValue.strike
          .replace(/\//g, "")
          .toUpperCase()}`,
        quantity: Number(-formValue.quantity),
        trade_price: Number(formValue.closeTradePrice),
        pnl_realized: Number(
          formValue.closeTradePrice - formValue.openTradePrice
        ),
        date_time: formValue.closeDate.toLocaleString(),
      },
    ];

    mutate(formData);
    onClose();
  };

  const resetForm = () => {
    setFormValue({
      ...intialState,
    });
  };

  return (
    <Drawer
      backdrop="static"
      size="sm"
      placement="right"
      onClose={onClose}
      onExit={() => resetForm()}
      {...rest}
    >
      <Drawer.Header>
        <Drawer.Title>Add a new Trade</Drawer.Title>
        <Drawer.Actions>
          <Button onClick={() => handleSubmit()} appearance="primary">
            Confirm
          </Button>
          <Button onClick={onClose} appearance="subtle">
            Cancel
          </Button>
        </Drawer.Actions>
      </Drawer.Header>

      <Drawer.Body>
        <Form
          fluid
          ref={formRef}
          formValue={formValue}
          model={model}
          onCheck={setFormError}
          onChange={setFormValue}
        >
          <Form.Group style={{ marginBottom: 30 }}>
            <Form.ControlLabel>Symbol</Form.ControlLabel>
            <Form.Control name="symbol" />
          </Form.Group>
          <Stack
            justifyContent="space-between"
            alignItems="flex-end"
            style={{ marginBottom: 20 }}
          >
            <Form.Group>
              <Form.ControlLabel>Strike</Form.ControlLabel>
              <Form.Control
                name="strike"
                placeholder="DD/MMM/YY 123C"
                style={{ width: 200 }}
              />
              <Form.HelpText tooltip>
                Enter strike date followed by price and type
              </Form.HelpText>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>Contract ID</Form.ControlLabel>
              <Form.Control
                name="contractId"
                placeholder="999999999"
                style={{ width: 200, marginBottom: 30 }}
              />
            </Form.Group>
          </Stack>
          <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
            <Form.Group>
              <Form.ControlLabel>Open Date</Form.ControlLabel>
              <Form.Control
                name="openDate"
                accepter={DatePicker}
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="MM/DD/YYYY HH:mm:ss"
                style={{ width: 200 }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Close Date</Form.ControlLabel>
              <Form.Control
                name="closeDate"
                accepter={DatePicker}
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="MM/DD/YYYY HH:mm:ss"
                style={{ width: 200 }}
              />
            </Form.Group>
          </Stack>
          <Stack justifyContent="space-between" style={{ marginBottom: 20 }}>
            <Form.Group>
              <Form.ControlLabel>Open Price</Form.ControlLabel>
              <Form.Control
                name="openTradePrice"
                accepter={InputNumber}
                style={{ width: 200 }}
              />
            </Form.Group>
            <Form.Group>
              <Form.ControlLabel>Close Price</Form.ControlLabel>
              <Form.Control
                name="closeTradePrice"
                accepter={InputNumber}
                style={{ width: 200 }}
              />
            </Form.Group>
          </Stack>
          <Form.Group>
            <Form.ControlLabel>Quantity</Form.ControlLabel>
            <Form.Control name="quantity" accepter={InputNumber} />
          </Form.Group>
        </Form>
      </Drawer.Body>
    </Drawer>
  );
};

export default DrawerView;

/*****
 * TODO: Create UI to display error messages to user
 * rsuites toast ??
 */
