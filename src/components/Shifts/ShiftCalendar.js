import React from 'react';
import {observer} from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';
import {Button} from 'react-bootstrap'


import BigCalendar from 'react-big-calendar';
require('react-big-calendar/lib/css/react-big-calendar.css');
BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

const eventStyleGetter = (event, start, end, isSelected) => {
    return {
        style: {
            backgroundColor: event.shift.color,
            borderRadius: '2px',
            color: 'black',
            border: '0px',
            display: 'block'
        }
    };
}

const Event = ({event: {shift, onEdit, onDelete}}) =>
    <span>
		<strong>
			{shift.title}
		</strong>
		<p>	{shift.volunteers ? shift.volunteers.length : 0} volunteers</p>
		<div className="toolbar" style={{position: 'absolute', right: 0, top: 0}}>
			<Button bsSize="xsmall" onClick={() => onEdit(shift)} className="glyphicon glyphicon-edit"/>
			<Button bsSize="xsmall" onClick={() => onDelete(shift)} className="glyphicon glyphicon-trash"/>
		</div>
	</span>;

const views = ['week', 'day']
export default observer(({
    shiftManagerModel: {
        date,
        slicedShifts,
        weekView,
        editShift,
        deleteShift,
        createShift
    }
}) => (
    <BigCalendar
        date={moment(date).toDate()}
        onNavigate={()=>{}}
        view={weekView ? 'week' : 'day'}
        eventPropGetter={eventStyleGetter}
        onView={()=>{}}
        toolbar={false}
        selectable={true}
        components={{
            event: Event
        }}
        onSelectSlot={slotInfo => {
            createShift(slotInfo.start, slotInfo.end);
        }}
        events={_.toArray(slicedShifts).map((shift) => ({
            start: new Date(shift.startDate),
            end: new Date(shift.endDate),
            shift,
            onEdit: editShift,
            onDelete: deleteShift
        }))}
    />
));