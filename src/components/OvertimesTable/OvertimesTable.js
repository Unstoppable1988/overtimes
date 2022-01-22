import { useHttp } from "../../hooks/http.hook";
import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AddOvertimeForm from "../AddOvertimeForm/AddOvertimeForm";
import 'bootstrap/dist/css/bootstrap.min.css';

const OvertimesTable = () => {

    const [overtimes, setOvertimes] = useState([]);
    const {request} = useHttp();

    useEffect(() => {
        getOvertimes(false);
    }, []);

    const getOvertimes = (paidStatus) => {
        request(`http://localhost:3001/overtimes/`)
        .then(data => setOvertimes(data.filter(item => item.paid === paidStatus)))
        .catch(err => console.log(err));
    };

    const onPaidSwitch = (id, status) => {
        let checkedItem = overtimes.filter(item => item.id === id);
        checkedItem = {...checkedItem[0], paid: status}
        console.log(checkedItem);
        request(`http://localhost:3001/overtimes/${id}`, "PUT", JSON.stringify(checkedItem))
        .then(setOvertimes(overtimes.filter(item => item.id !== id)))
        .catch(err => console.log(err));
    }

    const onDelete = (id) => {
        request(`http://localhost:3001/overtimes/${id}`, "DELETE")
        .then(setOvertimes(overtimes.filter(item => item.id !== id)))
        .catch(err => console.log(err));
    }

    const onAdd = (data) => {
        console.log(data);
        const overtime = calculateOvertime(data),
            start = timeConverter(Date.parse(data.start)),
            end = timeConverter(Date.parse(data.end)),
            number = overtimes.length > 0 ? overtimes[overtimes.length-1].number+1 : 1;
        let newItem = {...data, number, start, end, overtime, paid: false};
        request(`http://localhost:3001/overtimes/`, "POST", JSON.stringify(newItem))
        .then(setOvertimes([...overtimes, newItem]))
        .catch(err => console.log(err));
    }

    const calculateOvertime = (data) => {
        const start =  Date.parse(data.start),
            end = Date.parse(data.end),
            overtime = (end - start) / 60000;
        return overtime;
    }

    const timeConverter = (timestamp) => {
        const date = new Date(timestamp);
        const formatDate = param => param < 10 ? `0${param}` : param;
        const year = date.getFullYear();
        let month = formatDate(date.getMonth()+1),
            day = formatDate(date.getDate()),
            hour = formatDate(date.getHours()),
            min = formatDate(date.getMinutes());
        const time = `${day}.${month}.${year} ${hour}:${min}`;
        return time;
      }

    const renderOvertimes = (overtimes) => {
        const items = overtimes.map(item => {
            return (
                <>
                <Row className="mt-2" key={item.id}>
                    <Col>{item.number}</Col>
                    <Col>{item.start}</Col>
                    <Col>{item.end}</Col>
                    <Col>{item.overtime}</Col>
                    <Col className="col-4">{item.note}</Col>
                    <Col><Button className="btn btn-primary" onClick={() => onPaidSwitch(item.id, item.paid ? false : true)}>{item.paid ? 'Unpaid' : 'Paid'}</Button></Col>
                    <Col><Button className="btn btn-primary" onClick={() => onDelete(item.id)}>Delete</Button></Col>
                </Row>
                </>
            )
        });
        return (
            <>
                {items}
            </>
        )
    }

    const SwitchBtn = () => {
        const status = overtimes.length === 0 ? 'unpaid' : overtimes[0].paid ? 'unpaid' : 'paid';
        const boolStatus = overtimes.length === 0 ? false : overtimes[0].paid ? false : true;
        return (
            <Button className="btn btn-info" onClick={() => getOvertimes(boolStatus)}>Show {status}</Button>
        )
    }

    const items = renderOvertimes(overtimes);

    return (        
        <Container>
            <Row>
                <Col className="col-8">
                    <Row className="mt-2" style={{"fontWeight":"bold"}}>
                        <Col>Number</Col>
                        <Col>Start</Col>
                        <Col>End</Col>
                        <Col>Overtime</Col>
                        <Col className="col-4">Note</Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                    {items}
                    <SwitchBtn/>
                </Col>
                <Col className="col-4">
                    <AddOvertimeForm onAdd={onAdd}/>
                </Col>
            </Row>
        </Container>
    )
}

export default OvertimesTable;