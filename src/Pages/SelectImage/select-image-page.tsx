import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    FormControl, FormControlLabel, FormGroup, FormLabel,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Step,
    Stepper,
    Checkbox,
    styled,
    Typography, RadioGroup, Radio, ButtonGroup, IconButton
} from '@mui/material';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import PageWrapper from "../../components/PageWrapper";
import {AppContext, TAppContext} from "../../context/AppContext";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {
    exclusiveImageTypesType,
    favoriteImageType,
    FormDataOptionType,
    imageType,
    imageTypeStatisticType
} from "../../types/ApiTypes";
import {CloudSync, CloudUpload, PsychologyAlt} from "@mui/icons-material";
import {useLoaderData} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {hideAppLoading} from '../../redux/slice/AppStatusesSlice';
import {UrlConstants} from "../../constants/UrlConstants";
import example_man_generated from "../../assets/images/example_man_generated.png";
import example_woman_generated from "../../assets/images/example_woman_generated.jpg";

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

export default function SelectImagePage() {
    const {lang} = useContext<TAppContext>(AppContext);
    const [imageFile, setImageFile] = useState<File>();
    const [image, setImage] = useState<string>('');
    const [formZodiac, setFormZodiac] = useState('');
    const [formData, setFormData] = useState<FormDataOptionType[]>([])
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const {item, img_type_to_variant_groups, type_variant_to_img_group_variants, zodiac} = useLoaderData() as imageTypeStatisticType;
    const [disabledOptions, setDisabledOptions] = useState<number[]>([])
    const [formDataError, setFormDataError] = useState(false)

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

    const handleChangeZodiac = (e: SelectChangeEvent) => {
        setFormZodiac(e.target.value);
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

    const generateImage = () => {

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
            <PageWrapper back title={lang.HEADERS.SELECT_IMAGE_PANEL} >
                <Paper square elevation={2} sx={{mb: 1}}>
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
                    <CardActions>
                        <Typography sx={{textAlign: 'center'}} color="textSecondary" variant="caption" component="div">
                                {lang.DESCRIPTIONS.CLICK_BEFORE_POLITIC} {" "}
                            <Link underline="none" target='_blank' href={UrlConstants.URL_POLITIC}>{lang.DESCRIPTIONS.ABOUT_PANEL_POLITIC}</Link>{" "}
                                {lang.DESCRIPTIONS.AND}{" "}
                            <Link underline="none" target='_blank' href={UrlConstants.URL_RULE_APP}>{lang.DESCRIPTIONS.ABOUT_PANEL_RULES}</Link>.
                        </Typography>
                    </CardActions>
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
                                        <FormControl>
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
                                    src={userDbData?.sex === 2 ? example_man_generated : example_woman_generated}
                                    sx={{width: 50, height: 50}} />
                            </Step>
                            <Step>
                                <Avatar
                                    src={/*imageType.item.url ||*/ example_man_generated}
                                    variant="rounded"
                                    sx={{width: 50, height: 50}} />
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
