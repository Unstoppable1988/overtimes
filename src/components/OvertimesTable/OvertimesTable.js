import { useHttp } from "../../hooks/http.hook";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AddOvertimeForm from "../AddOvertimeForm/AddOvertimeForm";
import 'bootstrap/dist/css/bootstrap.min.css';

const OvertimesTable = () => {

    const [overtimes, setOvertimes] = useState([]);
    const {request} = useHttp();

    useEffect(() => {
        getOvertimes();
    }, []);

    const getOvertimes = () => {
        request(`http://localhost:3001/overtimes/`)
        .then(data => setOvertimes(data.filter(item => item.paid === false)))
        .catch(err => console.log(err));
    };

    const onPaid = (id) => {
        let checkedItem = overtimes.filter(item => item.id === id);
        checkedItem = {...checkedItem[0], paid: true}
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
        const overtime = calculateOvertime(data),
            start = timeConverter(Date.parse(data.start)),
            end = timeConverter(Date.parse(data.end));
        let newItem = {...data, start, end, overtime, paid: false};
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
                <Row className="mt-2" key={item.id}>
                    <Col>{item.number}</Col>
                    <Col>{item.start}</Col>
                    <Col>{item.end}</Col>
                    <Col>{item.overtime}</Col>
                    <Col><button className="btn btn-primary" onClick={() => onPaid(item.id)}>Paid</button></Col>
                    <Col><button className="btn btn-primary" onClick={() => onDelete(item.id)}>Delete</button></Col>
                </Row>
            )
        });
        return (
            <>
                {items}
            </>
        )
    }

    const items = renderOvertimes(overtimes);

    return (
        <Container>
            <Row>
                <Col>
                    {items}
                </Col>
                <Col>
                    <AddOvertimeForm onAdd={onAdd}/>
                </Col>
            </Row>
        </Container>
    )
}

export default OvertimesTable;