import {
    Alert,
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Stack,
    Step,
    Stepper,
    styled
} from '@mui/material';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import PageWrapper from "../../components/PageWrapper";
import {AppContext, TAppContext} from "../../context/AppContext";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {FormDataOptionType, imageTypeStatisticType} from "../../types/ApiTypes";
import {CloudSync, CloudUpload, PsychologyAlt} from "@mui/icons-material";
import {useLoaderData, useSubmit} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {hideAppLoading} from '../../redux/slice/AppStatusesSlice';
import example_man_generated from "../../assets/images/example_man_generated.png";
import example_woman_generated from "../../assets/images/example_woman_generated.jpg";
import AlertDialogAvailableImage from "../../components/Modals/AlertDialogAvailableImage";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type TError = {image?: boolean, options?: boolean, zodiac?: boolean}

export default function SelectImagePage() {
    const {lang} = useContext<TAppContext>(AppContext);
    const [imageFile, setImageFile] = useState<File>();
    let [image, setImage] = useState<string>('');
    const [formZodiac, setFormZodiac] = useState('');
    const [formData, setFormData] = useState<FormDataOptionType[]>([])
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const {item, img_type_to_variant_groups, type_variant_to_img_group_variants, zodiac, available_image_limit} = useLoaderData() as imageTypeStatisticType;
    const [disabledOptions, setDisabledOptions] = useState<number[]>([])
    const [formDataError, setFormDataError] = useState<TError|null>(null)
    const submit = useSubmit();

    const loadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImage(URL.createObjectURL(file));
        }
    }

    const validateForm = () => {
        let errors:TError = {};

        if (!imageFile && item.type === 'default') {
            errors.image = true;
        }

        if (item.type === 'default' && !!img_type_to_variant_groups.length && !formData.length ) {
            errors.options = true;
        }

        if (item.type === 'zodiac' && !formZodiac ) {
            errors.zodiac = true;
        }

        return !!Object.keys(errors).length ? errors : null;
    }

    const handleChangeZodiac = (e: SelectChangeEvent) => {
        setFormZodiac(e.target.value);
        setFormDataError(null);
    }

    const handleChangeOption = (e: ChangeEvent<HTMLInputElement>) => {
        const {dataset: {group_id}, value: option_id, checked} = e.target
        let data = formData;

        if (checked) {
            data.push({group_id: Number(group_id), option_id: Number(option_id)});
        } else {
            data = formData.filter((item) => item.group_id !== Number(group_id) && item.option_id !== Number(option_id));
        }

        setFormData(Array.from(data, (item) => item));
    }

    // function objectToFormData(obj, formData = new FormData(), parentKey = '') {
    //     for (const key in obj) {
    //         if (obj.hasOwnProperty(key)) {
    //             const value = obj[key];
    //             const formKey = parentKey ? `${parentKey}[${key}]` : key;
    //
    //             if (typeof value === 'object' && !(value instanceof File)) {
    //                 // Рекурсивный вызов для вложенных объектов
    //                 objectToFormData(value, formData, formKey);
    //             } else {
    //                 // Добавляем значение в FormData
    //                 formData.append(formKey, value);
    //             }
    //         }
    //     }
    //
    //     return formData;
    // }

    const arrayToFormData = (array: FormDataOptionType[], formData = new FormData(), parentKey = '') => {
        array.forEach((obj, index) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key as keyof FormDataOptionType];
                    const formKey = `${parentKey}[${index}][${key}]`; // Индексация для ключей

                    // if (typeof value === 'object' && !(value instanceof File)) {
                    //     // Рекурсивный вызов для вложенных объектов
                    //     objectToFormData(value, formData, formKey);
                    // } else {
                        formData.append(formKey, value as never);
                    // }
                }
            }
        });

        return formData;
    }

    const generateImage = () => {
        const errors = validateForm();
        setFormDataError(errors);

        if (!errors) {
            let formDataPost = new FormData();

            if (item.type === 'zodiac') {
                formDataPost.append('options[zodiac]', formZodiac);
            } else {
                formDataPost = arrayToFormData(formData, new FormData(), 'options');
            }

            formDataPost.append("image_file", imageFile as File);
            formDataPost.append("image_type_id", String(item.id));
            submit(formDataPost, {method: "post", action: "/generate-image", encType: "multipart/form-data"});
        }
    }

    useEffect(() => {
        dispatch(hideAppLoading());
    }, []);

    useEffect(() => {
        let disabled = [];

        if (formData.length) {
            // найдем доступные опции
            const lastOptionId = formData[formData.length - 1].option_id;
            const availableOptions = type_variant_to_img_group_variants.filter((item) => item.type_variant_id === lastOptionId)
            const imageGroups = Array.from(availableOptions, (item) => item.image_group_variant_id)

            for (const typeVariantToImgGroupVariant of type_variant_to_img_group_variants) {
                if (!imageGroups.includes(typeVariantToImgGroupVariant.image_group_variant_id)) {
                    disabled.push(typeVariantToImgGroupVariant.type_variant_id);
                }
            }
        }

        setDisabledOptions(disabled);
    }, [formData])

    return (
        <React.Fragment>
            {
                (available_image_limit.available_images === 0 || (!userDbData?.is_vip && !available_image_limit.nex_free_image_available)) &&
                    <AlertDialogAvailableImage available_image_limit={available_image_limit} />
            }
            <PageWrapper back title={lang.HEADERS.SELECT_IMAGE_PANEL} >
                <Paper square elevation={2} sx={{mb: 1, pb: 1}}>
                    <Box display="flex" alignItems="center" justifyContent="center" sx={{flexFlow: 'column', textAlign: 'center'}}>
                        <Avatar
                            src={image}
                            variant="rounded" sx={{ width: 150, height: 150, m: 2, }} />
                        {
                            imageFile
                                ?
                                <ButtonGroup variant="contained" aria-label="Basic button group">
                                    <Button component="label" tabIndex={-1}>
                                        <CloudSync />
                                        <VisuallyHiddenInput onChange={loadImage} accept="image/*" type="file" />
                                    </Button>
                                    <Button onClick={generateImage}>
                                        {lang.BUTTONS.SELECT_IMAGE_PANEL_CONTINUE}
                                    </Button>
                                </ButtonGroup>
                                :
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUpload />}
                                >
                                    {lang.BUTTONS.OPEN_GALLERY}
                                    <VisuallyHiddenInput onChange={loadImage} accept="image/*" type="file" />
                                </Button>
                        }
                    </Box>
                    {
                        formDataError &&
                            <Stack sx={{ width: '100%', pt: 1 }} spacing={1}>
                                {
                                    formDataError.options && <Alert severity="error">{lang.DESCRIPTIONS.SELECT_IMAGE_PANEL_ERROR_OPTIONS}</Alert>
                                }
                                {
                                    formDataError.image && <Alert severity="error">{lang.DESCRIPTIONS.SELECT_IMAGE}</Alert>
                                }
                                {
                                    formDataError.zodiac && <Alert severity="error">{lang.DESCRIPTIONS.SELECT_IMAGE_ZODIAC_PANEL_ERROR_OPTIONS}</Alert>
                                }
                            </Stack>
                    }
                </Paper>
                {
                    item.type === 'name' &&
                        <Card square elevation={2} sx={{mb: 1}}>
                            <CardHeader
                                avatar={<Avatar><PsychologyAlt /></Avatar>}
                                titleTypographyProps={{
                                    color: "primary",
                                    variant: "subtitle2",
                                    component:"div"
                            }} title={lang.DESCRIPTIONS.SELECT_IMAGE_NAME_PANEL_WHAT_ARE_YOU} />
                        </Card>
                }
                {
                    item.type === 'zodiac' &&
                        <Card square elevation={2} sx={{mb: 1, py: 2}}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">{lang.DESCRIPTIONS.SELECT_IMAGE_ZODIAC_PANEL_ZODIAC}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="zodiac"
                                    error={formDataError?.zodiac}
                                    label={lang.DESCRIPTIONS.SELECT_IMAGE_ZODIAC_PANEL_ZODIAC}
                                    onChange={handleChangeZodiac}
                                >
                                    {
                                        zodiac?.map((value: {label: string, value: string}, index) => <MenuItem key={index} value={value.value}>{value.label}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Card>
                }
                {
                    (item.type === 'default' && !!img_type_to_variant_groups.length) &&
                        <Card square elevation={2} sx={{mb: 1}}>
                            <CardHeader
                                titleTypographyProps={{
                                    color: "primary",
                                    variant: "subtitle2",
                                    component:"div"
                                }} title={lang.TITLES.SELECT_IMAGE_PANEL_SELECT_OPTIONS} />
                            <CardContent>
                                {
                                    img_type_to_variant_groups.map((group, groupKey) => (
                                        <FormControl key={groupKey} error={formDataError?.options}>
                                            <FormLabel component="legend" id={`options-group-${groupKey}`}>{group.group.name}</FormLabel>
                                            {
                                                img_type_to_variant_groups.length > 1
                                                    ?
                                                    <FormGroup>
                                                        {group.options.map((option, keyOption) => (<FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        sx={{
                                                                            cursor: disabledOptions.includes(option.id) ? 'no-drop' : ''
                                                                        }}
                                                                        disabled={disabledOptions.includes(option.id)}
                                                                        key={keyOption}
                                                                        value={option.id}
                                                                        inputProps={{
                                                                            // @ts-ignore
                                                                            'data-group_id': group.group.id,
                                                                        }}
                                                                        onChange={handleChangeOption}
                                                                    />
                                                                }
                                                                    label={option.name}
                                                                />
                                                            ))
                                                        }
                                                    </FormGroup>
                                                    :
                                                    <RadioGroup row>
                                                        {group.options.map((option, keyOption) => (
                                                                <FormControlLabel
                                                                    name={'option_' + group.group.id}
                                                                    key={keyOption}
                                                                    value={option.id}
                                                                    control={<Radio inputProps={{
                                                                        // @ts-ignore
                                                                        'data-group_id': group.group.id,
                                                                    }} onChange={handleChangeOption} />}
                                                                    label={option.name}
                                                                />
                                                            ))
                                                        }
                                                    </RadioGroup>
                                            }
                                        </FormControl>
                                    ))
                                }
                            </CardContent>
                        </Card>
                }
                <Card square elevation={2}>
                    <CardHeader titleTypographyProps={{
                        color: "textSecondary",
                        variant: "h6",
                        component:"div"
                    }} title={lang.TITLES.SELECT_IMAGE_PANEL_EXAMPLE} />
                    <CardContent>
                        <Stepper>
                            <Step>
                                <Avatar
                                    variant="rounded"
                                    src={image}
                                    sx={{width: 80, height: 80}} />
                            </Step>
                            <Step>
                                <Avatar
                                    src={item.url || (userDbData?.sex === 2 ? example_man_generated : example_woman_generated)}
                                    variant="rounded"
                                    sx={{width: 80, height: 80}} />
                            </Step>
                        </Stepper>
                    </CardContent>
                </Card>
                <Card square elevation={2} sx={{my: 1}}>
                    <CardHeader titleTypographyProps={{
                        color: "primary",
                        variant: "h6",
                        component:"div"
                    }} title={lang.DESCRIPTIONS.RECOMMENDED_PHOTOS} />
                    <CardContent sx={{pt: 0}}>
                        <Stack direction="row" sx={{ flexWrap: 'wrap' }} useFlexGap spacing={1}>
                            {
                                lang.RECOMMENDED_IMAGE_LABELS.map((value, index) => <Chip sx={{flexGrow: 1}} key={index} label={value} color="primary" />)
                            }
                        </Stack>
                    </CardContent>
                </Card>
                <Card square elevation={2} sx={{mb: 1}}>
                    <CardHeader titleTypographyProps={{
                        color: "error",
                        variant: "h6",
                        component:"div"
                    }} title={lang.DESCRIPTIONS.NO_RECOMMENDED_PHOTOS} />
                    <CardContent sx={{pt: 0}}>
                        <Stack direction="row" sx={{ flexWrap: 'wrap' }} useFlexGap spacing={1}>
                            {
                                lang.NO_RECOMMENDED_IMAGE_LABELS.map((value, index) => <Chip sx={{flexGrow: 1}} key={index} label={value} color="error" />)
                            }
                        </Stack>
                    </CardContent>
                </Card>
            </PageWrapper>
        </React.Fragment>
    );
}
