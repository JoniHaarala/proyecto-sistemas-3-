/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import Header from '../Head';
import Catacteristics from './Caracteristicas';
import Description from './Descripcion';
import TipoyOperacion from './Tipo&Operacion';
import { Map } from '..';
import { supabase } from '../../supabase/client';
import Checkbox from '@mui/material/Checkbox';
import SubirArchivos from '../MediaFiles';
import { useNavigate } from 'react-router-dom';


const steps = ['Tipo y operacion', 'Características', 'Ubicación', 'Archivos multimedia', 'Comodidades', 'Descripción'];


export default function AddPropiedad() {

    const navigate = useNavigate()

    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    //Estados para tipo y operacion
    /*------------------------------------------------------*/
    const [TipoyUbicacion, setTipoyUbicacion] = useState({
        idTipo: '',
        idCatVenta: '',
        idEstado: '',
        propietario: ''
    })
    /*------------------------------------------------------*/

    //Estados para Caracteristicas
    /*-------------------------------------------------------*/
    const [Caracteristicas, setCaracteristicas] = useState({
        precio: 0,
        expensas: 0,
        superficieCubierta: '',
        superficieDescubierta: '',
        superficieTotal: '',
        ambientes: '',
        dormitorios: '',
        baños: '',
        garage: '',
        antiguedad: ''
    })
    /*-------------------------------------------------------*/

    //Estados para Ubicacion
    /*-------------------------------------------------------*/
    const [direccion, setDireccion] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [localidad, setLocalidad] = useState('')
    const [barrio, setBarrio] = useState('')
    const [lat, setLat] = useState(-24.608189)
    const [lon, setLon] = useState(-65.385018)
    /*-------------------------------------------------------*/

    //Estados para Comodidades
    /*-------------------------------------------------------*/
    const [freatures, setFreatures] = useState({
        agua: false,
        luz: false,
        terraza: false,
        cloaca: false,
        telefono: false,
        comercial: false,
        gas: false,
        wifi: false,
        ac: false,
        pavimento: false,
        ascensor: false,
        alarma: false,
        vigilancia: false,
        lavadero: false,
        gimnasio: false,
        balcon: false,
        living: false,
        cocina: false,
        parilla: false,
        mascotas: false,
        piscina: false,
        jardin: false,
        oficina: false
    })
    /*-------------------------------------------------------*/

    //Estado para Descipcion
    /*-------------------------------------------------------*/
    const [textEditor, setTextEditor] = useState('<div>Aqui puede agregar una breve descripcion acerca de la propiedad, locacion, etc...</div>');


    /*------------------------------------------------------*/
    const Ubication = () => {
        // url buena alternativa para buscar localidades: https://nominatim.openstreetmap.org/search?q={nombre de la localidad separada con +; por ej:coronel+moldes}&format=json
        const [WordEntered, setWordEntered] = useState('')
        const [locations, setLocations] = useState([])
        const [SelectLocation, setSelectLocation] = useState([])

        const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

        const handleSelection = async e => {
            e.preventDefault()

            const params = {
                q: e.target.value,
                format: "json",
                addressdetails: 1
            };
            const queryString = new URLSearchParams(params).toString();
            const requestOptions = {
                method: "GET",
                redirect: "follow",
            };
            fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    console.log(JSON.parse(result));
                    setSelectLocation(JSON.parse(result));
                })
                .catch((err) => console.log("err: ", err));
            console.log(SelectLocation);
            const numCalle = SelectLocation[0].address.house_number
            setWordEntered(SelectLocation[0].display_name)
            setLat(SelectLocation[0].lat)
            setLon(SelectLocation[0].lon)
            setCiudad(SelectLocation[0].address.city || SelectLocation[0].address.state)
            setDireccion(SelectLocation[0].address.road +" "+ numCalle.toString())
            setBarrio(SelectLocation[0].address.suburb || SelectLocation[0].address.town || SelectLocation[0].address.village)
        }

        useEffect(() => {
            handleSelection()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        const clearInput = () => {
            setLocations([]);
        };

        return (
            <div className='px-2 ml-8 mt-20'>
                <Header category="" title="Ubicacion" />
                <div className='flex flex-col xl:flex-row'>
                    <section>
                        <Map lat={lat} lon={lon} />
                        <>
                            <div className="w-96 flex p-3 shadow-md rounded-xl my-5">
                                <input
                                    type="text"
                                    placeholder='Input location...'
                                    value={WordEntered}
                                    onChange={(e) => setWordEntered(e.target.value)}
                                    className="pl-2 w-full"
                                />
                                <div>
                                    {locations.length === 0 ? (
                                        <SearchIcon
                                            className="cursor-pointer"
                                            onClick={() => {
                                                const params = {
                                                    q: WordEntered,
                                                    format: "json",
                                                    addressdetails: 1,
                                                    polygon_geojson: 0,
                                                };
                                                const queryString = new URLSearchParams(params).toString();
                                                const requestOptions = {
                                                    method: "GET",
                                                    redirect: "follow",
                                                };
                                                fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                                                    .then((response) => response.json())
                                                    .then((result) => {
                                                        console.log(result);
                                                        setLocations(result);
                                                    })
                                                    .catch((err) => console.log("err: ", err));

                                                if (WordEntered === "") {
                                                    setLocations([]);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <CloseIcon id="clearBtn" onClick={clearInput} />
                                    )}
                                </div>
                            </div>
                            {locations.length !== 0 && (
                                <div className="h-40 w-[500px] overflow-hidden overflow-y-auto overflow-x-auto">
                                    {locations.slice(0, 15).map((value) =>
                                        <option className="text-sm hover:bg-gray-300 hover:cursor-pointer"
                                            value={value.display_name}
                                            onClick={handleSelection}
                                        >
                                            {value.display_name}
                                        </option>
                                    )}
                                </div>
                            )}
                        </>
                    </section>
                    <section className='px-10 flex flex-col'>
                        <TextField id="standard-basic" InputProps={{ readOnly: true }} sx={{ mb: 2, width: '400px' }} value={direccion} label="direccion" variant="standard" />
                        <TextField id="standard-basic" InputProps={{ readOnly: true }} sx={{ my: 2, width: '400px' }} value={barrio} label="barrio" variant="standard" />
                        <TextField id="standard-basic" InputProps={{ readOnly: true }} sx={{ my: 2, width: '400px' }} value={ciudad} label="ciudad" variant="standard" />
                        {/* <TextField id="standard-basic" InputProps={{ readOnly: true }} sx={{ my: 2, width: '400px' }} value={lat} label="latitud" variant="standard" />
                        <TextField id="standard-basic" InputProps={{ readOnly: true }} sx={{ my: 2, width: '400px' }} value={lon} label="longitud" variant="standard" /> */}
                    </section>
                </div>
            </div>
        )
    };
    //fin ventana ubicacion

    const MediaFiles = () => {
        return (
            <div className='px-2 ml-8 mt-20'>
                <Header category="" title="Archivos" />
                <SubirArchivos />
            </div>
        )
    };
    //fin ventana archivos

    const Propertys = () => {

        const handleChange = (prop) => (event) => {
            setFreatures({ ...freatures, [prop]: event.target.checked });
        };

        return (
            <div className='px-2 ml-8 mt-20'>
                <Header category="" title="Comodidades" />
                <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-items-center'>
                    <div className='flex flex-col items-end py-4 px-3 mr-3 md:mr-7'>
                        <label>Agua
                            <Checkbox
                                checked={freatures.agua}
                                onChange={handleChange('agua')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Luz
                            <Checkbox
                                checked={freatures.luz}
                                onChange={handleChange('luz')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Terraza
                            <Checkbox
                                checked={freatures.terraza}
                                onChange={handleChange('terraza')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Cloaca
                            <Checkbox
                                checked={freatures.cloaca}
                                onChange={handleChange('cloaca')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Telefono
                            <Checkbox
                                checked={freatures.telefono}
                                onChange={handleChange('telefono')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                    </div>

                    <div className='flex flex-col items-end py-4 px-3 mx-3 md:xr-7'>
                        <label>Comercial
                            <Checkbox
                                checked={freatures.comercial}
                                onChange={handleChange('comercial')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Gas
                            <Checkbox
                                checked={freatures.gas}
                                onChange={handleChange('gas')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Wifi
                            <Checkbox
                                checked={freatures.wifi}
                                onChange={handleChange('wifi')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>AC
                            <Checkbox
                                checked={freatures.ac}
                                onChange={handleChange('ac')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Pavimento
                            <Checkbox
                                checked={freatures.pavimento}
                                onChange={handleChange('pavimento')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                    </div>

                    <div className='flex flex-col items-end py-4 px-3 mx-3 md:xr-7'>
                        <label>Ascensor
                            <Checkbox
                                checked={freatures.ascensor}
                                onChange={handleChange('ascensor')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Alarma
                            <Checkbox
                                checked={freatures.alarma}
                                onChange={handleChange('alarma')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Vigilancia
                            <Checkbox
                                checked={freatures.vigilancia}
                                onChange={handleChange('vigilancia')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Lavadero
                            <Checkbox
                                checked={freatures.lavadero}
                                onChange={handleChange('lavadero')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Gimnasio
                            <Checkbox
                                checked={freatures.gimnasio}
                                onChange={handleChange('gimnasio')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                    </div>

                    <div className='flex flex-col items-end py-4 px-3 mx-3 md:xr-7'>
                        <label>Balcon
                            <Checkbox
                                checked={freatures.balcon}
                                onChange={handleChange('balcon')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Living
                            <Checkbox
                                checked={freatures.living}
                                onChange={handleChange('living')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Cocina
                            <Checkbox
                                checked={freatures.cocina}
                                onChange={handleChange('cocina')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Parilla
                            <Checkbox
                                checked={freatures.parilla}
                                onChange={handleChange('parilla')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Mascotas
                            <Checkbox
                                checked={freatures.mascotas}
                                onChange={handleChange('mascotas')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                    </div>

                    <div className='flex flex-col items-end py-4 px-3 mx-3 md:xr-7'>
                        <label>Piscina
                            <Checkbox
                                checked={freatures.piscina}
                                onChange={handleChange('piscina')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Jardin
                            <Checkbox
                                checked={freatures.jardin}
                                onChange={handleChange('jardin')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                        <label>Oficina
                            <Checkbox
                                checked={freatures.oficina}
                                onChange={handleChange('oficina')}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </label>
                    </div>
                </div>
            </div>
        )
    };
    //fin ventana caracteristicas
    /*------------------------------------------------------*/

    const isStepOptional = (step) => {
        return step === -1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleSubmit = async () => {
        //aca va el insert a la tabla de Propiedades agregando todos los elementos anteriores
        const propiedadData = {
            ...TipoyUbicacion,
            ...Caracteristicas,
            direccion,
            ciudad,
            barrio,
            localidad,
            latitud: lat,
            longitud: lon,
            ...freatures,
            descripcion: textEditor
        }
        //console.log(propiedadData);
        try {
            // esta seccion guarda en la base de datos los datos de la propiedad
            const { error } = await supabase
                .from('propiedad')
                .insert([
                    propiedadData
                ]);

            if (error) throw error
            //else console.log("guardado con exito")

        } catch (error) {
            console.error(error);
        }
        setActiveStep(0);
        navigate('/listarPropiedad')
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-gray-700 dark:text-gray-50 rounded-3xl">
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant="caption">Optional</Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 10, mb: 1, px: 2 }}>
                            Para finalizar con la operacion, oprima el boton GUARDAR.
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleSubmit}>Guardar</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {/* NOTA: {condicion && resultado} solo se ejecuta si la condicion "activeStep" es true // mejores practicas para el operador ternario {(condicion)?<TAG/>:<></>} */}
                        {activeStep === 0 && <TipoyOperacion tipoyOperacion={TipoyUbicacion} setTipoyOperacion={setTipoyUbicacion} />}

                        {activeStep === 1 && <Catacteristics caracteristicas={Caracteristicas} setCaracteristicas={setCaracteristicas} />}

                        {activeStep === 2 && <Ubication />}

                        {activeStep === 3 && <MediaFiles />}

                        {activeStep === 4 && <Propertys />}

                        {activeStep === 5 && <Description editor={textEditor} setEditor={setTextEditor} />}

                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Volver
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {isStepOptional(activeStep) && (
                                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                    Skip
                                </Button>
                            )}

                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                            </Button>
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        </div>
    );
}
